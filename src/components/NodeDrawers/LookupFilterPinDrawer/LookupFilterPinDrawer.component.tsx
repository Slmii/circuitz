import { useAddPin, useEditPin, useFormSubmit } from 'lib/hooks';
import { Drawer } from 'components/Drawer';
import { Node } from 'lib/types';
import { Pin } from 'declarations/nodes.declarations';
import { FilterPinDrawerForm } from '../FilterPinDrawer/FilterPinDrawerForm.component';

export const LookupFilterPinDrawer = ({ open, node, onClose }: { open: boolean; node?: Node; onClose: () => void }) => {
	const { formRef, submitter } = useFormSubmit();
	const { mutateAsync: addPin, isLoading: isAddPinLoading } = useAddPin();
	const { mutateAsync: editPin, isLoading: isEditPinLoading } = useEditPin();

	const handleOnSubmit = async (pin: Pin) => {
		if (!node) {
			throw new Error('Node is undefined');
		}

		const filterPin = node.pins.find(pin => 'LookupFilterPin' in pin.pin_type);

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
		<Drawer
			onClose={() => {
				onClose();
			}}
			onSubmit={submitter}
			isOpen={open}
			isLoading={isAddPinLoading || isEditPinLoading}
			title="Lookup Filter Pin"
			fullWidth
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
