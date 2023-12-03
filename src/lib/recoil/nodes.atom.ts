import { PinSourceType, Node } from 'lib/types';
import { atom } from 'recoil';

interface DeleteNodeState {
	open: boolean;
	nodeId?: number;
}

export interface PinDrawerState {
	open: boolean;
	type: PinSourceType;
	node?: Node;
}

export const deleteNodeState = atom<DeleteNodeState>({
	key: 'deleteNodeState',
	default: {
		open: false,
		nodeId: undefined
	}
});
