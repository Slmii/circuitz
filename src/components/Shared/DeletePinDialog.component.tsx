import { Dialog } from 'components/Dialog';
import { B1 } from 'components/Typography';
import { useDeletePin, useModal } from 'lib/hooks';
import { DeletePinModalProps } from 'lib/types';

export const DeletePinDialog = () => {
	const { mutateAsync: deletePin, isPending: isDeletePinPending } = useDeletePin();
	const { closeModal, state } = useModal<DeletePinModalProps>('DELETE_PIN');

	return (
		<Dialog
			title="Delete pin"
			open={state.isOpen}
			onConfirm={async () => {
				await deletePin({ nodeId: state.props.nodeId, data: state.props.pin });

				state.onSuccess?.();
				closeModal();
			}}
			onConfirmText="Delete"
			onConfirmColor="error"
			onConfirmLoading={isDeletePinPending}
			onClose={() => !isDeletePinPending && closeModal()}
			onCancelText="Cancel"
			onCancelDisabled={isDeletePinPending}
		>
			<B1>Are you sure you want to delete this pin? This action cannot be undone.</B1>
		</Dialog>
	);
};
