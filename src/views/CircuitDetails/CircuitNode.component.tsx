import { Stack, ButtonBase, Fade, Box, Divider } from '@mui/material';
import { IconButton } from 'components/IconButton';
import { Caption } from 'components/Typography';
import { useOnClickOutside } from 'lib/hooks';
import { stopPropagation } from 'lib/utils';
import pluralize from 'pluralize';
import { PropsWithChildren, useState } from 'react';
import { useXarrow } from 'react-xarrows';
import { CircuitNodeProps } from './CircuitDetails.types';
import { useSetRecoilState } from 'recoil';
import { deleteNodeState, pinDrawerState } from 'lib/recoil';

export const CircuitNode = ({
	node,
	isFirst,
	trace,
	nested = false,
	onClick,
	children
}: PropsWithChildren<CircuitNodeProps>) => {
	const updateXarrow = useXarrow();
	const [isShowSettings, setIsShowSettings] = useState(false);
	const [isShowPins, setIsShowPins] = useState(false);

	const setPrinDrawer = useSetRecoilState(pinDrawerState);
	const setDeleteNode = useSetRecoilState(deleteNodeState);
	const ref = useOnClickOutside(() => setIsShowPins(false));

	return (
		<Stack direction="row" spacing={2} alignItems="center" ref={ref}>
			<ButtonBase
				id={`node-${node?.id ?? 0}`}
				onClick={onClick}
				onLoad={updateXarrow}
				onMouseEnter={() => node && setIsShowSettings(true)}
				onMouseLeave={() => node && setIsShowSettings(false)}
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
								component="div"
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
					<IconButton
						icon="trash"
						size="small"
						tooltip="Delete Node"
						onClick={() => {
							if (!node) {
								return;
							}

							setIsShowPins(false);
							setDeleteNode({ open: true, nodeId: node.id });
						}}
					/>
					{!isFirst && (
						<>
							<Divider orientation="vertical" flexItem />
							<IconButton icon="javascript" size="small" tooltip="PrePin (soon)" disabled />
							<IconButton icon="javascript" size="small" tooltip="PostPin (soon)" disabled />
							<IconButton
								icon="filter"
								size="small"
								tooltip="FilterPin"
								onClick={() => {
									setIsShowPins(false);
									setPrinDrawer({ open: true, type: 'FilterPin' });
								}}
							/>
							{node && !('LookupCanister' in node.nodeType) && !('LookupHttpRequest' in node.nodeType) && (
								<IconButton
									icon="mapper"
									size="small"
									tooltip="MapperPin"
									onClick={() => setPrinDrawer({ open: true, type: 'MapperPin' })}
								/>
							)}
							{node && ('LookupCanister' in node.nodeType || 'LookupHttpRequest' in node.nodeType) && (
								// Only for Lookups
								<IconButton
									icon="transformer"
									size="small"
									tooltip="LookupTransformPin"
									onClick={() => setPrinDrawer({ open: true, type: 'LookupTransformPin' })}
								/>
							)}
						</>
					)}
				</Stack>
			</Fade>
		</Stack>
	);
};
