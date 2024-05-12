import { useAddPin, useEditPin, useFormSubmit, useModal } from 'lib/hooks';
import { Drawer } from 'components/Drawer';
import { DeletePinModalProps, Node } from 'lib/types';
import { Pin } from 'declarations/nodes.declarations';
import { FilterPinDrawerForm } from '../FilterPinDrawer/FilterPinDrawerForm.component';
import { Stack } from '@mui/material';
import { H3, H5 } from 'components/Typography';
import { getNodeMetaData } from 'lib/utils';

export const LookupFilterPinDrawer = ({ open, node, onClose }: { open: boolean; node?: Node; onClose: () => void }) => {
	const { formRef, submitter } = useFormSubmit();
	const { openModal } = useModal<DeletePinModalProps>('DELETE_PIN');

	const { mutateAsync: addPin, isPending: isAddPinPending } = useAddPin();
	const { mutateAsync: editPin, isPending: isEditPinPending } = useEditPin();

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
			isLoading={isAddPinPending || isEditPinPending}
			title={
				<Stack>
					<H3>Lookup Filter Pin</H3>
					{node && <H5 fontWeight="bold">{getNodeMetaData(node).name}</H5>}
				</Stack>
			}
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
