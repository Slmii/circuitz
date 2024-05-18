import { atom } from 'recoil';

export const isFormDirtyState = atom<boolean>({
	key: 'isFormDirtyState',
	default: false
});
