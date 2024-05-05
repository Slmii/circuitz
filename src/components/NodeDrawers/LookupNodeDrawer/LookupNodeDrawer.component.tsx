import { useFormSubmit } from 'lib/hooks/useFormSubmit';
import { useAddNode, useEditNode, useGetParam } from 'lib/hooks';
import { NodeType } from 'declarations/nodes.declarations';
import { LookupNodeCanisterForm } from './LookupNodeCanisterForm.component';
import { LookupNodeDrawerProps } from '../NodeDrawers.types';
import { Drawer } from 'components/Drawer';
import { Dialog } from 'components/Dialog';
import { useState } from 'react';
import { Alert } from 'components/Alert';
import { LookupNodeHttpRequestForm } from './LookupNodeHttpRequestForm.component';

export const LookupNodeDrawer = ({ node, open, nodeType, onClose }: LookupNodeDrawerProps) => {
	const [formData, setFormData] = useState<NodeType | null>(null);
	const circuitId = useGetParam('circuitId');
	const { formRef, submitter } = useFormSubmit();

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
		} else {
			// Edit call
			await editNode({
				nodeId: node.id,
				data: formData
			});
		}

		onClose();
	};

	return (
		<>
			<Drawer
				onClose={onClose}
				onSubmit={submitter}
				isOpen={open}
				isLoading={isAddNodePending || isEditNodePending}
				title={nodeType === 'LookupCanister' ? 'Lookup Canister' : 'Lookup HTTP Request'}
				fullWidth
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
