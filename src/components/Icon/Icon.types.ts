import { SvgIconProps } from '@mui/material/SvgIcon';
import { Icons } from 'components/icons';

export interface IconProps extends SvgIconProps {
	icon: Icons;
	spacingLeft?: boolean;
	spacingRight?: boolean;
	tooltip?: string;
}
