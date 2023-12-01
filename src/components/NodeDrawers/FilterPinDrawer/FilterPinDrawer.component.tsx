import { useAddPin, useEditPin, useFormSubmit } from 'lib/hooks';
import { Drawer } from 'components/Drawer';
import { FilterPinDrawerForm } from './FilterPinDrawerForm.component';
import { Node } from 'lib/types';
import { Pin } from 'declarations/nodes.declarations';

export const FilterPinDrawer = ({ open, node, onClose }: { open: boolean; node: Node; onClose: () => void }) => {
	const { formRef, submitter } = useFormSubmit();
	const { mutateAsync: addPin, isLoading: isAddPinLoading } = useAddPin();
	const { mutateAsync: editPin, isLoading: isEditPinLoading } = useEditPin();

	const handleOnSubmit = async (pin: Pin) => {
		const filterPin = node.pins.find(pin => 'FilterPin' in pin.pin_type);

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
			title="Filter Pin"
			fullWidth
		>
			<FilterPinDrawerForm formRef={formRef} node={node} onProcessFilter={handleOnSubmit} />
		</Drawer>
	);
};
