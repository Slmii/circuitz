import { Dialog } from 'components/Dialog';
import { B1 } from 'components/Typography';
import { useDeleteNode, useModal } from 'lib/hooks';
import { DeleteNodeModalProps } from 'lib/types';

export const DeleteNodeDialog = () => {
	const { mutateAsync: deleteNode, isPending: isDeleteNodePending } = useDeleteNode();
	const { closeModal, state } = useModal<DeleteNodeModalProps>('DELETE_NODE');

	return (
		<Dialog
			title="Delete pin"
			open={state.isOpen}
			onConfirm={async () => {
				await deleteNode(state.props.nodeId);

				state.onSuccess?.();
				closeModal();
			}}
			onConfirmText="Delete"
			onConfirmColor="error"
			onConfirmLoading={isDeleteNodePending}
			onClose={() => !isDeleteNodePending && closeModal()}
			onCancelText="Cancel"
			onCancelDisabled={isDeleteNodePending}
		>
			<B1>Are you sure you want to delete this node? This action cannot be undone.</B1>
		</Dialog>
	);
};
