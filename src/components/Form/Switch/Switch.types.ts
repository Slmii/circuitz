export interface SwitchProps {
	label?: string;
	name: string;
	disabled?: boolean;
	onChange?: (checked: boolean) => void;
}

export interface StandaloneSwitchProps extends Omit<SwitchProps, 'onChange'> {
	value: boolean;
	onChange: (checked: boolean) => void;
}
