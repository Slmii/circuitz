export interface SwitchProps {
	label?: string;
	name: string;
	disabled?: boolean;
	onChange?: (checked: boolean) => void;
}

export interface StandaloneSwitchProps extends Omit<SwitchProps, 'onChange'> {
	value: boolean;
	labelPlacement?: 'start' | 'end';
	onChange: (checked: boolean) => void;
}
