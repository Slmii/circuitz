import { Stack, Fade, ButtonBase } from '@mui/material';
import { B1, H5 } from 'components/Typography';
import { useMemo, useState } from 'react';
import { Node, NodeSourceType } from 'lib/types';
import { IconButton } from 'components/IconButton';
import { AddNodeButton } from 'components/Button';
import { LookupNodeDrawer, InputNodeDrawer, FilterPinDrawer } from 'components/NodeDrawers';
import { getNodeMetaData } from 'lib/utils';
import { CircuitNode } from './CircuitNode.component';
import { NodeDialogProps } from './CircuitDetails.types';
import { useRecoilState } from 'recoil';
import { deleteNodeState, pinDrawerState } from 'lib/recoil';
import { useDeleteNode, useGetCircuitTraces, useGetParam, useOnClickOutside, useToggleNodeStatus } from 'lib/hooks';
import { Icon } from 'components/Icon';
import { Dialog } from 'components/Dialog';

export const CircuitNodes = ({ nodes }: { nodes: Node[] }) => {
	const [isAddNode, setIsAddNode] = useState(false);
	const [nodeDialogProps, setNodeDialogProps] = useState<NodeDialogProps>({ open: false, type: 'Unknown' });

	const ref = useOnClickOutside(() => setIsAddNode(false));
	const [{ open: isDeleteNodeModalOpen, nodeId: deleteNodeId }, setDeleteNodeState] = useRecoilState(deleteNodeState);
	const [{ open: isPinDrawerOpen, type: pinDrawerType }, setPrinDrawer] = useRecoilState(pinDrawerState);

	const circuitId = useGetParam('circuitId');
	const { data: circuitTraces, isLoading: isCircuitTracesLoading } = useGetCircuitTraces(Number(circuitId));
	const { mutateAsync: deleteNode, isLoading: isDeleteNodeLoading } = useDeleteNode();
	const { mutate: toggleStatus } = useToggleNodeStatus();

	const traces = useMemo(() => {
		if (!circuitTraces) {
			return [];
		}

		return circuitTraces.filter(trace => trace.errors.filter(error => !error.resolvedAt));
	}, [circuitTraces]);

	if (!(!!circuitTraces && !isCircuitTracesLoading)) {
		return null;
	}

	return (
		<>
			<Stack direction="column" gap={1} width="100%">
				{!nodes.length ? (
					// Show 'Add Input Node' button if there are no nodes at all
					<Stack
						sx={{
							backgroundColor: 'background.paper',
							borderRadius: 1
						}}
					>
						<ButtonBase
							onClick={() => setNodeDialogProps({ type: 'Canister', open: true })}
							sx={{
								p: 2,
								justifyContent: 'flex-start',
								borderRadius: 'inherit'
							}}
						>
							<Icon icon="add-linear" spacingRight />
							<H5 fontWeight="bold">Add Input Node</H5>
						</ButtonBase>
					</Stack>
				) : (
					<>
						{nodes.map((node, index) => (
							<CircuitNode
								key={node.id}
								node={node}
								trace={traces.find(trace => trace.nodeId === node.id)}
								isFirst={index === 0}
								index={index}
								onToggleNodeStatus={node =>
									toggleStatus({ circuitId: node.circuitId, nodeId: node.id, enabled: node.isEnabled })
								}
								onNodeSelect={node => setNodeDialogProps({ type: getNodeMetaData(node).type, node, open: true })}
							/>
						))}
						<Stack direction="column" spacing={1} mt={4} alignItems="flex-start">
							<IconButton icon={!isAddNode ? 'add-square' : 'close-square'} onClick={() => setIsAddNode(!isAddNode)} />
							<Fade in={isAddNode}>
								<Stack direction="column" spacing={1} ref={ref}>
									<H5>What's next?</H5>
									<Stack direction="row" alignItems="center" spacing={2}>
										<AddNodeButton
											icon="infinite"
											label="Lookup Canister"
											onClick={() => {
												setIsAddNode(false);
												setNodeDialogProps({ open: true, type: 'LookupCanister' });
											}}
										/>
										<AddNodeButton
											icon="request"
											label="Lookup HTTP Request"
											onClick={() => {
												setIsAddNode(false);
												setNodeDialogProps({ open: true, type: 'LookupHttpRequest' });
											}}
										/>
										<AddNodeButton icon="transformer" label="Transformer" onClick={() => {}} />
										<AddNodeButton icon="mapper" label="Mapper" onClick={() => {}} />
										<AddNodeButton icon="output-linear" label="Output" onClick={() => {}} />
									</Stack>
								</Stack>
							</Fade>
						</Stack>
					</>
				)}
			</Stack>
			<InputNodeDrawer
				nodeType={nodeDialogProps.type as NodeSourceType}
				open={nodeDialogProps.open && (nodeDialogProps.type === 'Canister' || nodeDialogProps.type === 'HttpRequest')}
				node={nodeDialogProps?.node}
				onClose={() => setNodeDialogProps(prevState => ({ ...prevState, open: false }))}
			/>
			<LookupNodeDrawer
				nodeType={nodeDialogProps.type as NodeSourceType}
				open={
					nodeDialogProps.open &&
					(nodeDialogProps.type === 'LookupCanister' || nodeDialogProps.type === 'LookupHttpRequest')
				}
				node={nodeDialogProps?.node}
				onClose={() => setNodeDialogProps(prevState => ({ ...prevState, open: false }))}
			/>
			<FilterPinDrawer
				open={isPinDrawerOpen && pinDrawerType === 'FilterPin'}
				onClose={() => setPrinDrawer(prevState => ({ ...prevState, open: false }))}
			/>
			<Dialog
				title="Delete node"
				open={isDeleteNodeModalOpen}
				onConfirm={async () => {
					if (deleteNodeId) {
						await deleteNode(deleteNodeId);
						setDeleteNodeState({ open: false });
					}
				}}
				onConfirmText="Delete"
				onConfirmColor="error"
				onConfirmLoading={isDeleteNodeLoading}
				onClose={() => setDeleteNodeState({ open: false })}
				onCancelText="Cancel"
				onCancelDisabled={isDeleteNodeLoading}
			>
				<B1>Are you sure you want to delete this node? This action cannot be undone.</B1>
			</Dialog>
		</>
	);
};
