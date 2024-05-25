import { DialogProps as MuiDialogProps } from '@mui/material';
import React from 'react';

export interface DialogProps extends Omit<MuiDialogProps, 'title'> {
	title: string | JSX.Element;
	/**
	 * A custom action to be rendered in the dialog. This can be used to render a form or any other custom content.
	 * The Confirm and Cancel buttons will be overridden by the custom action.
	 */
	customAction?: React.ReactNode;
	width?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	onConfirmText?: string;
	onCancelText?: string;
	onConfirmDisabled?: boolean;
	onConfirmLoading?: boolean;
	onCancelDisabled?: boolean;
	onCancelLoading?: boolean;
	onConfirmColor?: 'primary' | 'error' | 'warning';
	onConfirm?: () => void;
	onClose: () => void;
}
