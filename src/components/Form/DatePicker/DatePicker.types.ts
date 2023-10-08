export interface DatePickerProps {
	name: string;
	label?: string;
	required?: boolean;
	disabled?: boolean;
	minDate?: Date;
	maxDate?: Date;
	fullWidth?: boolean;
	onChange?: (date: Date | null) => void;
}
