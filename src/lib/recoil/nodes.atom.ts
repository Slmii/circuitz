import { atom } from 'recoil';

interface DeleteNodeState {
	isDeleteNodeModalOpen: boolean;
	nodeToDelete?: number;
}

export const deleteNodeState = atom<DeleteNodeState>({
	key: 'deleteNodeState',
	default: {
		isDeleteNodeModalOpen: false,
		nodeToDelete: undefined
	}
});
