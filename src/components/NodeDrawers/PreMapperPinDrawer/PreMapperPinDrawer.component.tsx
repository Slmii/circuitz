import { useAddPin, useEditPin, useFormSubmit, useModal } from 'lib/hooks';
import { Drawer } from 'components/Drawer';
import { DeletePinModalProps, Node } from 'lib/types';
import { Pin } from 'declarations/nodes.declarations';
import { MapperPinDrawerForm } from './MapperPinDrawerForm.component';

export const PreMapperPinDrawer = ({ open, node, onClose }: { open: boolean; node?: Node; onClose: () => void }) => {
	const { formRef, submitter } = useFormSubmit();
	const { openModal } = useModal<DeletePinModalProps>('DELETE_PIN');

	const { mutateAsync: addPin, isPending: isAddPinPending } = useAddPin();
	const { mutateAsync: editPin, isPending: isEditPinPending } = useEditPin();

	const preMapperPin = node?.pins.find(pin => 'PreMapperPin' in pin.pin_type);

	const handleOnSubmit = async (pin: Pin) => {
		if (!node) {
			return;
		}

		if (!preMapperPin) {
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
			onClose={onClose}
			onSubmit={submitter}
			isOpen={open}
			isLoading={isAddPinPending || isEditPinPending}
			title="PreMapper Pin"
			fullWidth
			onDeletePin={
				preMapperPin
					? () => {
							if (!node) {
								return;
							}

							openModal(
								{
									nodeId: node.id,
									pin: preMapperPin
								},
								{
									onSuccess: () => onClose()
								}
							);
					  }
					: undefined
			}
		>
			{!!node && open && (
				<MapperPinDrawerForm mapperType="PreMapperPin" formRef={formRef} node={node} onProcessMapper={handleOnSubmit} />
			)}
		</Drawer>
	);
};
