import { useAddPin, useDeletePin, useEditPin, useFormSubmit } from 'lib/hooks';
import { Drawer } from 'components/Drawer';
import { FilterPinDrawerForm } from './FilterPinDrawerForm.component';
import { Node } from 'lib/types';
import { Pin } from 'declarations/nodes.declarations';
import { Dialog } from 'components/Dialog';
import { useState } from 'react';
import { B1 } from 'components/Typography';

export const FilterPinDrawer = ({ open, node, onClose }: { open: boolean; node?: Node; onClose: () => void }) => {
	const { formRef, submitter } = useFormSubmit();
	const { mutateAsync: addPin, isLoading: isAddPinLoading } = useAddPin();
	const { mutateAsync: editPin, isLoading: isEditPinLoading } = useEditPin();
	const { mutateAsync: deletePin, isLoading: isDeletePinLoading } = useDeletePin();

	const [isDeletePinModalOpen, setIsDeletePinModalOpen] = useState(false);

	const filterPin = node?.pins.find(pin => 'FilterPin' in pin.pin_type);

	const handleOnSubmit = async (pin: Pin) => {
		if (!node) {
			return;
		}

		if (!filterPin) {
			await addPin({
				nodeId: node.id,
				data: pin
			});
		} else {
			await editPin({
				nodeId: node.id,
				data: pin
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
				isLoading={isAddPinLoading || isEditPinLoading}
				title="Filter Pin"
				fullWidth
				onDeletePin={filterPin ? () => setIsDeletePinModalOpen(true) : undefined}
			>
				{node && (
					<FilterPinDrawerForm filterType="FilterPin" formRef={formRef} node={node} onProcessFilter={handleOnSubmit} />
				)}
			</Drawer>
			<Dialog
				title="Delete pin"
				open={isDeletePinModalOpen}
				onConfirm={async () => {
					if (!node || !filterPin) {
						return;
					}

					await deletePin({ nodeId: node.id, data: filterPin });

					setIsDeletePinModalOpen(false);
					onClose();
				}}
				onConfirmText="Delete"
				onConfirmColor="error"
				onConfirmLoading={isDeletePinLoading}
				onClose={() => !isDeletePinLoading && setIsDeletePinModalOpen(false)}
				onCancelText="Cancel"
				onCancelDisabled={isDeletePinLoading}
			>
				<B1>Are you sure you want to delete this pin? This action cannot be undone.</B1>
			</Dialog>
		</>
	);
};
