import { useAddPin, useEditPin, useFormSubmit, useModal } from 'lib/hooks';
import { Drawer } from 'components/Drawer';
import { DeletePinModalProps, Node } from 'lib/types';
import { Pin } from 'declarations/nodes.declarations';
import { MapperPinDrawerForm } from '../PreMapperPinDrawer/MapperPinDrawerForm.component';

export const PostMapperPinDrawer = ({ open, node, onClose }: { open: boolean; node?: Node; onClose: () => void }) => {
	const { formRef, submitter } = useFormSubmit();
	const { openModal } = useModal<DeletePinModalProps>('DELETE_PIN');

	const { mutateAsync: addPin, isPending: isAddPinPending } = useAddPin();
	const { mutateAsync: editPin, isPending: isEditPinPending } = useEditPin();

	const postMapperPin = node?.pins.find(pin => 'PostMapperPin' in pin.pin_type);

	const handleOnSubmit = async (pin: Pin) => {
		if (!node) {
			return;
		}

		if (!postMapperPin) {
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
			title="PostMapper Pin"
			fullWidth
			onDeletePin={
				postMapperPin
					? () => {
							if (!node) {
								return;
							}

							openModal(
								{
									nodeId: node.id,
									pin: postMapperPin
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
				<MapperPinDrawerForm
					mapperType="PostMapperPin"
					formRef={formRef}
					node={node}
					onProcessMapper={handleOnSubmit}
				/>
			)}
		</Drawer>
	);
};
