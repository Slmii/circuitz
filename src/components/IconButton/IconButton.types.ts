import { IconButtonProps } from '@mui/material/IconButton';
import { Icons } from 'components/icons';

export interface CustomIconButtonProps extends IconButtonProps {
	icon: Icons;
	tooltip?: string;
	loading?: boolean;
}
