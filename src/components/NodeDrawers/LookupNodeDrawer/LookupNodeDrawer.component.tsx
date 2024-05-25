import { useFormSubmit } from 'lib/hooks/useFormSubmit';
import { useAddNode, useEditNode, useGetParam, useModal, useSnackbar } from 'lib/hooks';
import { NodeType } from 'declarations/nodes.declarations';
import { LookupNodeCanisterForm } from './LookupNodeCanisterForm.component';
import { LookupNodeDrawerProps } from '../NodeDrawers.types';
import { Drawer } from 'components/Drawer';
import { Dialog } from 'components/Dialog';
import { useState } from 'react';
import { Alert } from 'components/Alert';
import { LookupNodeHttpRequestForm } from './LookupNodeHttpRequestForm.component';
import { Stack } from '@mui/material';
import { H3, H5 } from 'components/Typography';
import { getNodeMetaData } from 'lib/utils';
import { DeleteNodeModalProps } from 'lib/types';
import { NODE_ADD_SUCCESS, NODE_EDIT_SUCCESS } from 'lib/constants';

export const LookupNodeDrawer = ({ node, open, nodeType, onClose }: LookupNodeDrawerProps) => {
	const [formData, setFormData] = useState<NodeType | null>(null);
	const circuitId = useGetParam('circuitId');
	const { formRef, submitter } = useFormSubmit();
	const { openModal } = useModal<DeleteNodeModalProps>('DELETE_NODE');
	const { successSnackbar } = useSnackbar();

	const { mutateAsync: addNode, isPending: isAddNodePending } = useAddNode();
	const { mutateAsync: editNode, isPending: isEditNodePending } = useEditNode();

	const handleOnConfirmCycles = async () => {
		if (!formData) {
			return formData;
		}

		// Close dialog
		setFormData(null);

		// Add call
		if (!node) {
			await addNode({
				circuitId: Number(circuitId),
				data: formData
			});

			successSnackbar(NODE_ADD_SUCCESS);
		} else {
			// Edit call
			await editNode({
				nodeId: node.id,
				data: formData
			});

			successSnackbar(NODE_EDIT_SUCCESS);
		}
	};

	return (
		<>
			<Drawer
				onClose={onClose}
				onSubmit={submitter}
				isOpen={open}
				isLoading={isAddNodePending || isEditNodePending}
				title={
					<Stack>
						<H3>{nodeType === 'LookupCanister' ? 'Lookup Canister' : 'Lookup HTTP Request'}</H3>
						{node && <H5 fontWeight="bold">{getNodeMetaData(node).name}</H5>}
					</Stack>
				}
				fullWidth
				onDelete={() => {
					if (!node) {
						return;
					}

					openModal({
						nodeId: node.id,
						onSuccess: () => onClose()
					});
				}}
			>
				{open && (
					<>
						{nodeType === 'LookupCanister' ? (
							<LookupNodeCanisterForm formRef={formRef} node={node} onProcessNode={setFormData} />
						) : (
							<LookupNodeHttpRequestForm formRef={formRef} node={node} onProcessNode={setFormData} />
						)}
					</>
				)}
			</Drawer>
			<Dialog
				open={!!formData}
				onConfirmText="Confirm"
				onConfirm={handleOnConfirmCycles}
				title="Confirm cycles"
				onCancelText="Close"
				onClose={() => setFormData(null)}
			>
				<Alert severity="warning">
					Ensure the correct number of cycles is set. If unsure, use the <b>Preview request</b> to verify. Insufficient
					cycles will cause the call to fail.
				</Alert>
			</Dialog>
		</>
	);
};
