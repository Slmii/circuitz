import { useFormSubmit } from 'lib/hooks';
import { Drawer } from 'components/Drawer';
import { FilterPinDrawerForm } from './FilterPinDrawerForm.component';
// import { Pin } from 'declarations/nodes.declarations';
import { Node } from 'lib/types';

export const FilterPinDrawer = ({ open, node, onClose }: { open: boolean; node?: Node; onClose: () => void }) => {
	const { formRef, submitter } = useFormSubmit();

	// TODO add pin calls add/edit
	// const { mutateAsync: editNode, isLoading: isEditNodeLoading } = useEditNode();

	const handleOnSubmit = async () => {
		if (!node) {
			return;
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
			isLoading={false}
			title="Filter Pin"
			fullWidth
		>
			<FilterPinDrawerForm formRef={formRef} onProcessFilter={handleOnSubmit} />
		</Drawer>
	);
};
