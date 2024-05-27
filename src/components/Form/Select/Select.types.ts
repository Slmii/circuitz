import { SelectChangeEvent } from '@mui/material/Select';
import { Icons } from 'components/icons';
import { ReactNode } from 'react';

export interface SelectProps {
	options: Option[];
	name: string;
	label?: string;
	fullWidth?: boolean;
	required?: boolean;
	disabled?: boolean;
	helperText?: string | ReactNode;
	placeholder?: string;
	startIcon?: Icons;
	endIcon?: Icons;
	endElement?: JSX.Element;
	onChange?: (value: string) => void;
	customLabel?: (option: Option) => JSX.Element | string;
}

export interface Option<T = string> {
	id: T;
	label: string;
	disabled?: boolean;
	icon?: Icons;
}

export interface StandaloneSelectProps extends Omit<SelectProps, 'onChange'> {
	value: string;
	error?: string;
	startIcon?: Icons;
	endIcon?: Icons;
	endElement?: JSX.Element;
	onChange: (event: SelectChangeEvent<string>, child: React.ReactNode) => void;
}
