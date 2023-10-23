import { Stack, Fade } from '@mui/material';
import { Icon } from 'components/Icon';
import { B1, H5 } from 'components/Typography';
import { useState } from 'react';
import { Node as INode, NodeSourceType } from 'lib/types';
import { IconButton } from 'components/IconButton';
import { AddNodeButton } from 'components/Button';
import { CircuitNode, Nodes } from 'components/Node';
import { LookupNodeDrawer, InputNodeDrawer } from 'components/NodeDrawers';
import { getNodeSourceType } from 'lib/utils';

interface DialogState {
	open: boolean;
	type: NodeSourceType;
	node?: INode;
}

export const CircuitNodes = ({ nodes }: { nodes: INode[] }) => {
	const [isAddNode, setIsAddNode] = useState(false);
	const [dialogState, setDialogState] = useState<DialogState>({ open: false, type: 'Canister' });

	return (
		<>
			<Stack direction="column" alignItems="flex-start" spacing={isAddNode ? 6 : 3}>
				{!nodes.length ? (
					// Show 'Add Input Node' button if there are no nodes at all
					<CircuitNode id="add" onClick={() => setDialogState({ type: 'Canister', open: true })}>
						<Icon icon="add-square" spacingRight fontSize="small" />
						<B1>Add Input Node</B1>
					</CircuitNode>
				) : (
					<>
						<Stack direction="column" spacing={8}>
							<Nodes
								nodes={nodes}
								onNodeClick={node => setDialogState({ type: getNodeSourceType(node), node, open: true })}
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
													onClick={() => setDialogState({ open: true, type: 'LookupCanister' })}
												/>
												<AddNodeButton
													icon="request"
													label="Lookup HTTP Request"
													onClick={() => setDialogState({ open: true, type: 'LookupHttpRequest' })}
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
				nodeType={dialogState.type}
				open={dialogState.open && (dialogState.type === 'Canister' || dialogState.type === 'HttpRequest')}
				node={dialogState?.node}
				onClose={() => setDialogState(prevState => ({ ...prevState, open: false }))}
			/>
			<LookupNodeDrawer
				nodeType={dialogState.type}
				open={dialogState.open && (dialogState.type === 'LookupCanister' || dialogState.type === 'LookupHttpRequest')}
				node={dialogState?.node}
				onClose={() => setDialogState(prevState => ({ ...prevState, open: false }))}
			/>
		</>
	);
};
