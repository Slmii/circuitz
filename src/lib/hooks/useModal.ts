import { ModalClient, modalState } from 'lib/recoil';
import { ModalType } from 'lib/types';
import { useRecoilState } from 'recoil';

type ModalClientDefinedProps<T> = Omit<ModalClient<T>, 'props'> & { props: T };

export const useModal = <T = ModalClient>(type: ModalType) => {
	const [state, setState] = useRecoilState(modalState<T>(type));

	const openModal = (props?: T & { onSuccess?: () => void }) => {
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
		state: state as ModalClientDefinedProps<T>,
		openModal,
		closeModal
	};
};
