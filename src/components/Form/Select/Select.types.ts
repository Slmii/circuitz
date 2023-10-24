import { SelectChangeEvent } from '@mui/material/Select';

export interface SelectProps {
	options: Option[];
	name: string;
	label?: string;
	fullWidth?: boolean;
	onChange?: (value: string) => void;
	required?: boolean;
	disabled?: boolean;
	helperText?: string;
	placeholder?: string;
	customLabel?: (option: Option) => JSX.Element | string;
}

export interface Option<T = string> {
	id: T;
	label: string;
	disabled?: boolean;
}

export interface StandaloneSelectProps extends Omit<SelectProps, 'onChange'> {
	value: string;
	error?: string;
	onChange: (event: SelectChangeEvent<string>, child: React.ReactNode) => void;
}
