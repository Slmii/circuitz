import { MenuProps as MuiMenuProps } from '@mui/material';
import { Icons } from 'components/icons';

export interface MenuProps extends Omit<MuiMenuProps, 'open'> {
	label: JSX.Element | ((open: boolean) => JSX.Element);
	id: string;
	menu: MenuItem[];
	fullWidth?: boolean;
	multiSelect?: boolean;
	onClose?: () => void;
}

export interface MenuItem {
	id: string;
	label: string;
	icon?: Icons;
	image?: string;
	action?: () => void;
	disabled?: boolean;
	selected?: boolean;
	loading?: boolean;
	color?: 'primary' | 'secondary' | 'error' | 'success';
}
