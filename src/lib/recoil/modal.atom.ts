import { ModalStateProps, ModalType } from 'lib/types';
import { RecoilState, atomFamily } from 'recoil';

export interface ModalClient<T = ModalStateProps> {
	isOpen: boolean;
	props?: T;
	onSuccess?: () => void;
}

// Keep `any` here, because we don't know what the type of `props` will be
// We typed it in `modalState` below
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _modalState = atomFamily<ModalClient<any>, ModalType>({
	key: 'modalState',
	default: {
		isOpen: false,
		props: undefined,
		onSuccess: undefined
	}
});

export function modalState<T>(id: ModalType): RecoilState<ModalClient<T>> {
	return _modalState(id);
}
