import { ReactNode } from 'react';

export interface NodeDrawerProps {
	title: string | ReactNode;
	isOpen: boolean;
	isDisabled: boolean;
	isLoading: boolean;
	onClose: () => void;
	onSubmit: () => void;
}
