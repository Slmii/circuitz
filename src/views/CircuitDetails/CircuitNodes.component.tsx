import { Stack, Fade } from '@mui/material';
import { Icon } from 'components/Icon';
import { B1, H5 } from 'components/Typography';
import { useState } from 'react';
import { Node } from 'lib/types';
import { IconButton } from 'components/IconButton';
import { AddNodeButton } from 'components/Button';
import { Nodes } from 'components/Nodes';
import { LookupNodeDrawer, InputNodeDrawer, FilterPinDrawer } from 'components/NodeDrawers';
import { getNodeSourceType } from 'lib/utils';
import { CircuitNode } from './CircuitNode.component';
import { NodeDialogProps } from './CircuitDetails.types';
import { useRecoilState } from 'recoil';
import { pinDrawerState } from 'lib/recoil';

export const CircuitNodes = ({ nodes }: { nodes: Node[] }) => {
	const [isAddNode, setIsAddNode] = useState(false);
	const [{ open: isPinDrawerOpen, type: pinDrawerType }, setPrinDrawer] = useRecoilState(pinDrawerState);
	const [nodeDialogProps, setNodeDialogProps] = useState<NodeDialogProps>({ open: false, type: 'Canister' });

	return (
		<>
			<Stack direction="column" alignItems="flex-start" spacing={isAddNode ? 6 : 3}>
				{!nodes.length ? (
					// Show 'Add Input Node' button if there are no nodes at all
					<CircuitNode isFirst onClick={() => setNodeDialogProps({ type: 'Canister', open: true })}>
						<Icon icon="add-square" spacingRight fontSize="small" />
						<B1>Add Input Node</B1>
					</CircuitNode>
				) : (
					<>
						<Stack direction="column" spacing={8}>
							<Nodes
								nodes={nodes}
								onNodeClick={node => setNodeDialogProps({ type: getNodeSourceType(node), node, open: true })}
							/>
						</Stack>
						<Stack direction="row" spacing={1} alignItems="center">
							{!isAddNode && <IconButton icon="add-square" onClick={() => setIsAddNode(true)} />}
							<Fade in={isAddNode}>
								<div>
									<Fade in={isAddNode} timeout={0}>
										<Stack direction="column" spacing={1}>
											<H5>What's next?</H5>
											<Stack direction="row" alignItems="center" spacing={2}>
												<AddNodeButton
													icon="infinite"
													label="Lookup Canister"
													onClick={() => setNodeDialogProps({ open: true, type: 'LookupCanister' })}
												/>
												<AddNodeButton
													icon="request"
													label="Lookup HTTP Request"
													onClick={() => setNodeDialogProps({ open: true, type: 'LookupHttpRequest' })}
												/>
												<AddNodeButton icon="transformer" label="Transformer" onClick={() => {}} />
												<AddNodeButton icon="mapper" label="Mapper" onClick={() => {}} />
												<AddNodeButton icon="export" label="Export" onClick={() => {}} />
												<IconButton
													icon="close-linear"
													tooltip="Close"
													size="small"
													onClick={() => setIsAddNode(false)}
												/>
											</Stack>
										</Stack>
									</Fade>
								</div>
							</Fade>
						</Stack>
					</>
				)}
			</Stack>
			<InputNodeDrawer
				nodeType={nodeDialogProps.type}
				open={nodeDialogProps.open && (nodeDialogProps.type === 'Canister' || nodeDialogProps.type === 'HttpRequest')}
				node={nodeDialogProps?.node}
				onClose={() => setNodeDialogProps(prevState => ({ ...prevState, open: false }))}
			/>
			<LookupNodeDrawer
				nodeType={nodeDialogProps.type}
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
		</>
	);
};
