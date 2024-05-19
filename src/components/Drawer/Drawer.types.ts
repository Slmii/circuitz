import { ReactNode } from 'react';

export interface NodeDrawerProps {
	title: string | ReactNode;
	isOpen: boolean;
	isLoading: boolean;
	isDisabled?: boolean;
	fullWidth?: boolean;
	disableHandlebarsHelpers?: boolean;
	onClose: () => void;
	onSubmit: () => void;
	onDelete?: () => void;
}
