import { Icons } from 'components/icons';
import { ReactNode } from 'react';

interface SelectAutocompleteDefault {
	name: string;
	label?: string;
	secondaryLabel?: string;
	options: Option[];
	required?: boolean;
	disabled?: boolean;
	helperText?: string | ReactNode;
	placeholder?: string;
	fullWidth?: boolean;
	isOptionsLoading?: boolean;
	startIcon?: Icons;
	endIcon?: Icons;
	outsideElement?: ReactNode;
}

export interface SelectAutocompleteMultipleProps extends SelectAutocompleteDefault {
	max?: number;
	onChange?: (value: Option[]) => void;
}

export interface SelectAutocompleteSingleProps extends SelectAutocompleteDefault {
	onChange?: (value: Option | null) => void;
}

export interface Option {
	id: string;
	label: string;
	groupBy?: string;
}

export interface StandaloneAutocompleteProps extends Omit<SelectAutocompleteDefault, 'onChange'> {
	value: Option | null;
	error?: string;
	onChange: (option: Option | null) => void;
}
