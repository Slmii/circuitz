import { Xwrapper } from 'react-xarrows';
import { Node } from './Node.component';
import { useGetCircuitTraces, useGetParam } from 'lib/hooks';
import { useMemo } from 'react';
import { NodesProps } from './Nodes.types';
import { useRecoilState } from 'recoil';
import { deleteNodeState } from 'lib/recoil';
import { Dialog } from 'components/Dialog';
import { B1 } from 'components/Typography';
import { useMutation } from '@tanstack/react-query';
import { api } from 'api/index';

export const Nodes = ({ nodes, onNodeClick }: NodesProps) => {
	const [{ isDeleteNodeModalOpen, nodeToDelete }, setDeleteNodeState] = useRecoilState(deleteNodeState);

	const circuitId = useGetParam('circuitId');
	const { data: circuitTraces } = useGetCircuitTraces(Number(circuitId));
	const { mutateAsync: deleteNode, isLoading: isDeleteNodeLoading } = useMutation(api.Nodes.deleteNode);

	const traces = useMemo(() => {
		if (!circuitTraces) {
			return [];
		}

		return circuitTraces.filter(trace => trace.errors.filter(error => !error.resolvedAt));
	}, [circuitTraces]);

	return (
		<>
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
			<Dialog
				title="Delete node"
				open={isDeleteNodeModalOpen}
				onConfirm={async () => {
					if (nodeToDelete) {
						await deleteNode(nodeToDelete);
						setDeleteNodeState({ isDeleteNodeModalOpen: false });
					}
				}}
				onConfirmText="Delete"
				onConfirmColor="error"
				onConfirmLoading={isDeleteNodeLoading}
				onClose={() => setDeleteNodeState({ isDeleteNodeModalOpen: false })}
				onCancelText="Cancel"
				onCancelDisabled={isDeleteNodeLoading}
			>
				<B1>Are you sure you want to delete this node? This action cannot be undone.</B1>
			</Dialog>
		</>
	);
};
