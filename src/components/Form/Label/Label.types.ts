export interface LabelProps {
	required?: boolean;
	label: string;
	secondaryLabel?: string;
	/**
	 * Show label for radio or checkbox
	 */
	radioOrCheckbox?: boolean;
	disabled?: boolean;
}
