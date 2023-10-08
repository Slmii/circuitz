import { Icons } from 'components/icons';
import { BaseTextFieldProps } from '@mui/material/TextField/TextField';
import { ChangeEvent } from 'react';

export interface FieldProps extends Omit<StandaloneFieldProps, 'onChange' | 'value' | 'errorMessage'> {
	onChange?: (value: string) => void;
}

export interface UploadFieldProps {
	name: string;
	label: JSX.Element;
	accept?: string;
	multiple?: boolean;
	disabled?: boolean;
	required?: boolean;
	fullWidth?: boolean;
	onChange?: (attachment: Array<File>) => void;
}

export interface StandaloneFieldProps extends BaseTextFieldProps {
	value: string;
	errorMessage?: string;
	onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	startIcon?: Icons;
	endIcon?: Icons;
	endElement?: JSX.Element;
	helperText?: string;
	multiline?: boolean;
	multilineRows?: number;
	maxLength?: number;
	readOnly?: boolean;
	name: string;
	label?: string;
}
