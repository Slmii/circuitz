import { useAddPin, useEditPin, useFormSubmit, useModal, useSnackbar } from 'lib/hooks';
import { Drawer } from 'components/Drawer';
import { FilterPinDrawerForm } from './FilterPinDrawerForm.component';
import { DeletePinModalProps, Node } from 'lib/types';
import { Pin } from 'declarations/nodes.declarations';
import { Stack } from '@mui/material';
import { H3, H5 } from 'components/Typography';
import { getNodeMetaData } from 'lib/utils';
import { PIN_ADD_SUCCESS, PIN_EDIT_SUCCESS } from 'lib/constants';

export const FilterPinDrawer = ({ open, node, onClose }: { open: boolean; node?: Node; onClose: () => void }) => {
	const { formRef, submitter } = useFormSubmit();
	const { openModal } = useModal<DeletePinModalProps>('DELETE_PIN');
	const { successSnackbar } = useSnackbar();

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

			successSnackbar(PIN_ADD_SUCCESS);
		} else {
			await editPin({
				nodeId: node.id,
				data: pin
			});

			successSnackbar(PIN_EDIT_SUCCESS);
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
			onDelete={
				node && filterPin
					? () => {
							openModal({
								nodeId: node.id,
								pin: filterPin,
								onSuccess: () => onClose()
							});
					  }
					: undefined
			}
		>
			{!!node && open && (
				<FilterPinDrawerForm filterType="FilterPin" formRef={formRef} node={node} onProcessFilter={handleOnSubmit} />
			)}
		</Drawer>
	);
};
