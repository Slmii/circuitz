import { Box, ButtonBase, Divider, Fade, Stack, useTheme } from '@mui/material';
import { Icon } from 'components/Icon';
import { IconButton } from 'components/IconButton';
import { B1, Caption, H5 } from 'components/Typography';
import { useOnClickOutside } from 'lib/hooks';
import { Trace, Node as INode } from 'lib/types';
import { stopPropagation } from 'lib/utils/browser-events.utils';
import { getNodeName, getNodeTitle } from 'lib/utils/nodes.utilts';
import pluralize from 'pluralize';
import { PropsWithChildren, useMemo, useState } from 'react';
import Xarrow, { anchorCustomPositionType, useXarrow } from 'react-xarrows';

export const Node = ({
	node,
	isLast,
	isFirst,
	trace,
	onNodeClick
}: {
	node: INode;
	isFirst: boolean;
	isLast: boolean;
	trace?: Trace;
	onNodeClick: (node: INode) => void;
}) => {
	const theme = useTheme();

	const endAnchor = useMemo((): anchorCustomPositionType => {
		if (isFirst) {
			return {
				offset: {
					x: -150,
					y: -69
				},
				position: 'bottom'
			};
		}

		return {
			offset: {
				x: -150,
				y: -36
			},
			position: 'middle'
		};
	}, [isFirst]);

	return (
		<Stack spacing={1}>
			<H5 sx={{ pl: !isFirst ? 8 : undefined }}>{isFirst ? 'Input Node' : getNodeTitle(node)}</H5>
			<CircuitNode id={node.id.toString()} trace={trace} onClick={() => onNodeClick(node)}>
				<Icon icon="infinite" />
				<B1>{getNodeName(node)}</B1>
			</CircuitNode>
			{!isLast && (
				<Xarrow
					startAnchor={{
						offset: {
							x: -150,
							y: 33
						},
						position: 'middle'
					}}
					endAnchor={endAnchor}
					lineColor={theme.palette.secondary.main}
					headColor={theme.palette.secondary.main}
					path="grid"
					strokeWidth={1}
					headSize={10}
					start={`node-${node.id}`}
					end={`node-${node.id + 1}`}
				/>
			)}
		</Stack>
	);
};

export const CircuitNode = ({
	id,
	trace,
	nested = false,
	onClick,
	children
}: PropsWithChildren<{ id: string; trace?: Trace; nested?: boolean; onClick: () => void }>) => {
	const updateXarrow = useXarrow();
	const [isShowSettings, setIsShowSettings] = useState(false);
	const [isShowPins, setIsShowPins] = useState(false);

	const ref = useOnClickOutside(() => setIsShowPins(false));

	return (
		<Stack direction="row" spacing={1} alignItems="center" ref={ref}>
			<ButtonBase
				id={`node-${id}`}
				onClick={onClick}
				onLoad={updateXarrow}
				onMouseEnter={() => setIsShowSettings(true)}
				onMouseLeave={() => setIsShowSettings(false)}
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'flex-start',
					gap: 1,
					p: 2,
					width: 400,
					mb: 8,
					ml: nested ? 15 : 0,
					backgroundColor: 'background.default',
					borderRadius: 1,
					color: 'text.primary',
					border: theme => `1px solid ${theme.palette.divider}`
				}}
			>
				<Stack direction="row" width="100%" justifyContent="space-between" alignItems="center">
					<Stack direction="row" alignItems="center" spacing={1}>
						{children}
					</Stack>
					{trace && trace.errors.length && (
						<Caption color="error.main">
							{trace.errors.length} {pluralize('error', trace.errors.length)}
						</Caption>
					)}
					<Fade in={isShowSettings}>
						<Box>
							<IconButton
								size="small"
								icon="settings"
								tooltip="Setting"
								{...stopPropagation({
									onClick: () => setIsShowPins(!isShowPins)
								})}
							/>
						</Box>
					</Fade>
				</Stack>
			</ButtonBase>
			<Fade in={isShowPins}>
				<Stack direction="row" spacing={1}>
					<IconButton icon="trash" size="small" tooltip="Delete Node" />
					<Divider orientation="vertical" flexItem />
					<IconButton icon="javascript" size="small" tooltip="PrePin (soon)" disabled />
					<IconButton icon="javascript" size="small" tooltip="PostPin (soon)" disabled />
					<IconButton icon="filter" size="small" tooltip="FilterPin" />
					<IconButton icon="mapper" size="small" tooltip="MapperPin" />
					<IconButton icon="transformer" size="small" tooltip="LookupTransformPin" />
				</Stack>
			</Fade>
		</Stack>
	);
};
