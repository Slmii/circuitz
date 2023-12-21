import { ReactNode } from 'react';

export interface NodeDrawerProps {
	title: string | ReactNode;
	isOpen: boolean;
	isLoading: boolean;
	isDisabled?: boolean;
	fullWidth?: boolean;
	onClose: () => void;
	onSubmit: () => void;
	onDeletePin?: () => void;
}
