import { Stack, useTheme } from '@mui/material';
import { Icon } from 'components/Icon';
import { B1, H5 } from 'components/Typography';
import { getNodeName, getNodeTitle } from 'lib/utils';
import { useMemo } from 'react';
import Xarrow, { anchorCustomPositionType } from 'react-xarrows';
import { CircuitNode } from 'views/CircuitDetails';
import { NodeProps } from './Nodes.types';

export const Node = ({ node, isLast, isFirst, trace, onNodeClick }: NodeProps) => {
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
			<CircuitNode nodeId={node.id} isFirst={isFirst} trace={trace} onClick={() => onNodeClick(node)}>
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
