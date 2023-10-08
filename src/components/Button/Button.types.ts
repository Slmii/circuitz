import { ButtonProps } from '@mui/material/Button';
import { Icons } from 'components/icons';

export interface CustomButtonProps extends ButtonProps {
	tooltip?: string;
	loading?: boolean;
	startIcon?: Icons;
	endIcon?: Icons;
	startImage?: string;
	endImage?: string;
	component?: React.ElementType;
	target?: string;
}

export interface ButtonLinkProps extends CustomButtonProps {
	to: string;
}
