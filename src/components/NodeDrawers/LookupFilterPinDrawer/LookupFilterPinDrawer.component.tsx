import { useAddPin, useEditPin, useFormSubmit, useModal } from 'lib/hooks';
import { Drawer } from 'components/Drawer';
import { DeletePinModalProps, Node } from 'lib/types';
import { Pin } from 'declarations/canister.declarations';
import { FilterPinDrawerForm } from '../FilterPinDrawer/FilterPinDrawerForm.component';

export const LookupFilterPinDrawer = ({ open, node, onClose }: { open: boolean; node?: Node; onClose: () => void }) => {
	const { formRef, submitter } = useFormSubmit();
	const { openModal } = useModal<DeletePinModalProps>('DELETE_PIN');

	const { mutateAsync: addPin, isLoading: isAddPinLoading } = useAddPin();
	const { mutateAsync: editPin, isLoading: isEditPinLoading } = useEditPin();

	const lookupFilterPin = node?.pins.find(pin => 'LookupFilterPin' in pin.pin_type);

	const handleOnSubmit = async (pin: Pin) => {
		if (!node) {
			return;
		}

		if (!lookupFilterPin) {
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
		<Drawer
			onClose={() => {
				onClose();
			}}
			onSubmit={submitter}
			isOpen={open}
			isLoading={isAddPinLoading || isEditPinLoading}
			title="Lookup Filter Pin"
			fullWidth
			onDeletePin={
				lookupFilterPin
					? () => {
							if (!node) {
								return;
							}

							openModal(
								{
									nodeId: node.id,
									pin: lookupFilterPin
								},
								{
									onSuccess: () => onClose()
								}
							);
					  }
					: undefined
			}
		>
			{node && (
				<FilterPinDrawerForm
					filterType="LookupFilterPin"
					formRef={formRef}
					node={node}
					onProcessFilter={handleOnSubmit}
				/>
			)}
		</Drawer>
	);
};
