import { ModalClient, modalState } from 'lib/recoil';
import { ModalType } from 'lib/types';
import { useRecoilState } from 'recoil';

type ModalClientDefinedProps<T, U> = Omit<ModalClient<T, U>, 'props'> & { props: T };

export const useModal = <T = ModalClient, U = unknown>(type: ModalType) => {
	const [state, setState] = useRecoilState(modalState<T, U>(type));

	const openModal = (props?: T & { onSuccess?: (data?: U) => void }) => {
		setState({
			isOpen: true,
			props,
			onSuccess: props?.onSuccess
		});
	};

	const closeModal = () => {
		setState({
			...modalState,
			isOpen: false
		});
	};

	return {
		state: state as ModalClientDefinedProps<T, U>,
		openModal,
		closeModal
	};
};
