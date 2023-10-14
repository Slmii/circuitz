import { Xwrapper } from 'react-xarrows';
import { Node as INode } from 'lib/types';
import { Node } from './Node.component';
import { useGetCircuitTraces, useGetParam } from 'lib/hooks';
import { useMemo } from 'react';

export const Nodes = ({ nodes, onNodeClick }: { nodes: INode[]; onNodeClick: (node: INode) => void }) => {
	const circuitId = useGetParam('circuitId');
	const { data: circuitTraces } = useGetCircuitTraces(Number(circuitId));

	const traces = useMemo(() => {
		if (!circuitTraces) {
			return [];
		}

		return circuitTraces.filter(trace => trace.errors.filter(error => !error.resolvedAt));
	}, [circuitTraces]);

	return (
		<Xwrapper>
			{nodes.map((node, index) => (
				<Node
					key={node.id}
					node={node}
					trace={traces.find(trace => trace.nodeId === node.id)}
					isFirst={index === 0}
					isLast={index === nodes.length - 1}
					onNodeClick={onNodeClick}
				/>
			))}
		</Xwrapper>
	);
};
