import { ButtonBase, Stack, useTheme } from '@mui/material';
import { B1, Caption, H5 } from 'components/Typography';
import { Trace, Node as INode } from 'lib/types';
import { getInputNodeFormValues } from 'lib/utils/nodes.utilts';
import pluralize from 'pluralize';
import { PropsWithChildren, useMemo } from 'react';
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
					x: 0,
					y: 0
				},
				position: 'left'
			};
		}

		return {
			offset: {
				x: -150,
				y: -30
			},
			position: 'middle'
		};
	}, [isFirst]);

	return (
		<Stack spacing={1}>
			<H5>Input Node</H5>
			<CircuitNode id={node.id.toString()} trace={trace} onClick={() => onNodeClick(node)}>
				<img src="/public/logos/icp.png" style={{ width: 24, height: 24 }} />
				<B1>{getInputNodeFormValues(node).name}</B1>
			</CircuitNode>
			{!isLast && (
				<Xarrow
					startAnchor={{
						offset: {
							x: -150,
							y: 30
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

	return (
		<ButtonBase
			id={`node-${id}`}
			onClick={onClick}
			onLoad={updateXarrow}
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
			<Stack direction="row" alignItems="center" spacing={1}>
				{children}
			</Stack>
			{trace && trace.errors.length && (
				<Caption color="error.main">
					{trace.errors.length} {pluralize('error', trace.errors.length)}
				</Caption>
			)}
		</ButtonBase>
	);
};
