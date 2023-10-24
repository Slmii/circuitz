import { useFormSubmit } from 'lib/hooks/useFormSubmit';
import { Drawer } from 'components/Drawer';
import { FilterPinDrawerForm } from './FilterPinDrawerForm.component';

export const FilterPinDrawer = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
	const { formRef, submitter } = useFormSubmit();

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
			<FilterPinDrawerForm formRef={formRef} />
		</Drawer>
	);
};
