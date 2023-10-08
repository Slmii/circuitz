import { Option } from '../Select/Select.types';

export interface RadioButtonProps {
	label?: string;
	name: string;
	disabled?: boolean;
	required?: boolean;
	onChange?: (value: string) => void;
	row?: boolean;
	options: Option[];
}
