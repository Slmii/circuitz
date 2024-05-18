import { useAddPin, useEditPin, useFormSubmit, useModal } from 'lib/hooks';
import { Drawer } from 'components/Drawer';
import { FilterPinDrawerForm } from './FilterPinDrawerForm.component';
import { DeletePinModalProps, Node } from 'lib/types';
import { Pin } from 'declarations/nodes.declarations';
import { Stack } from '@mui/material';
import { H3, H5 } from 'components/Typography';
import { getNodeMetaData } from 'lib/utils';

export const FilterPinDrawer = ({ open, node, onClose }: { open: boolean; node?: Node; onClose: () => void }) => {
	const { formRef, submitter } = useFormSubmit();
	const { openModal } = useModal<DeletePinModalProps>('DELETE_PIN');

	const { mutateAsync: addPin, isPending: isAddPinPending } = useAddPin();
	const { mutateAsync: editPin, isPending: isEditPinPending } = useEditPin();

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
	};

	return (
		<Drawer
			onClose={onClose}
			onSubmit={submitter}
			isOpen={open}
			isLoading={isAddPinPending || isEditPinPending}
			title={
				<Stack>
					<H3>Filter Pin</H3>
					{node && <H5 fontWeight="bold">{getNodeMetaData(node).name}</H5>}
				</Stack>
			}
			fullWidth
			onDelete={() => {
				if (!node || !filterPin) {
					return;
				}

				openModal({
					nodeId: node.id,
					pin: filterPin,
					onSuccess: () => onClose()
				});
			}}
		>
			{!!node && open && (
				<FilterPinDrawerForm filterType="FilterPin" formRef={formRef} node={node} onProcessFilter={handleOnSubmit} />
			)}
		</Drawer>
	);
};
