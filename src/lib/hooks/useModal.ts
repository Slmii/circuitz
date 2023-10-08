import { ModalClient, modalState } from 'lib/recoil/modal.atom';
import { ModalType } from 'lib/types/Modal';
import { useRecoilState } from 'recoil';

type ModalClientDefinedProps<T> = Omit<ModalClient<T>, 'props'> & { props: T };

export const useModal = <T = ModalClient>(type: ModalType) => {
	const [state, setState] = useRecoilState(modalState<T>(type));

	const openModal = (props: T, onSuccess?: () => void) => {
		setState({
			open: true,
			props,
			onSuccess
		});
	};

	const closeModal = () => {
		setState({
			...modalState,
			open: false
		});
	};

	return {
		state: state as ModalClientDefinedProps<T>,
		openModal,
		closeModal
	};
};
