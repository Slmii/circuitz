import { useAddPin, useEditPin, useFormSubmit, useModal } from 'lib/hooks';
import { Drawer } from 'components/Drawer';
import { DeletePinModalProps, Node } from 'lib/types';
import { Pin } from 'declarations/nodes.declarations';
import { MapperPinDrawerForm } from './MapperPinDrawerForm.component';

export const MapperPinDrawer = ({ open, node, onClose }: { open: boolean; node?: Node; onClose: () => void }) => {
	const { formRef, submitter } = useFormSubmit();
	const { openModal } = useModal<DeletePinModalProps>('DELETE_PIN');

	const { mutateAsync: addPin, isLoading: isAddPinLoading } = useAddPin();
	const { mutateAsync: editPin, isLoading: isEditPinLoading } = useEditPin();

	const mapperPin = node?.pins.find(pin => 'MapperPin' in pin.pin_type);

	const handleOnSubmit = async (pin: Pin) => {
		if (!node) {
			return;
		}

		if (!mapperPin) {
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
			isLoading={isAddPinLoading || isEditPinLoading}
			title="Mapper Pin"
			fullWidth
			onDeletePin={
				mapperPin
					? () => {
							if (!node) {
								return;
							}

							openModal(
								{
									nodeId: node.id,
									pin: mapperPin
								},
								{
									onSuccess: () => onClose()
								}
							);
					  }
					: undefined
			}
		>
			{node && <MapperPinDrawerForm formRef={formRef} node={node} onProcessMapper={handleOnSubmit} />}
		</Drawer>
	);
};
