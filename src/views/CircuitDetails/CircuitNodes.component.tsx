import { Stack, Collapse, Fade } from '@mui/material';
import { Icon } from 'components/Icon';
import { B1, H5 } from 'components/Typography';
import { useState } from 'react';
import { InputNodeDrawer } from 'components/NodeDrawer';
import { Node as INode } from 'lib/types/Node';
import { IconButton } from 'components/IconButton';
import { AddNodeButton } from 'components/Button';
import { CircuitNode, Nodes } from 'components/Node';

interface DialogState {
	node?: INode;
	type: 'input' | 'output';
}

export const CircuitNodes = ({ nodes }: { nodes: INode[] }) => {
	const [isAddNode, setIsAddNode] = useState(false);
	const [dialogState, setDialogState] = useState<DialogState | null>(null);

	return (
		<>
			<Stack direction="column" alignItems="flex-start" spacing={isAddNode ? 6 : 3}>
				{!nodes.length ? (
					// Show 'Add Input Node' button if there are no nodes at all
					<CircuitNode id="add" onClick={() => setDialogState({ type: 'input' })}>
						<Icon icon="add-square" spacingRight fontSize="small" />
						<B1>Add Input Node</B1>
					</CircuitNode>
				) : (
					<>
						<Nodes nodes={nodes} onNodeClick={node => setDialogState({ type: 'input', node })} />
						<Stack direction="row" spacing={1} alignItems="center">
							{!isAddNode && <IconButton icon="add-square" onClick={() => setIsAddNode(true)} />}
							<Collapse in={isAddNode} orientation="horizontal">
								<div>
									<Fade in={isAddNode} timeout={0}>
										<Stack direction="column" spacing={1}>
											<H5>What's next?</H5>
											<Stack direction="row" alignItems="center" spacing={2}>
												<AddNodeButton icon="request" label="Request" onClick={() => {}} />
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
							</Collapse>
						</Stack>
					</>
				)}
			</Stack>
			<InputNodeDrawer
				node={dialogState?.node}
				open={dialogState?.type === 'input'}
				onClose={() => setDialogState(null)}
			/>
		</>
	);
};

// Input(Input),
// 	/// Define a transformation rule to rename fields, remove fields, and/or structurally optimize the response data returned by the Node before the response data is merged back into the source record.
// 	Transformer(Transformer),
// 	/// Define one or more mappings to transform the data returned by the Node to different specified fields.
// 	Mapper(Mapper),
// 	Ouput(Ouput),
// 	/// Define a lookup to retrieve data from a different Canister.
// 	Lookup(Lookup),
