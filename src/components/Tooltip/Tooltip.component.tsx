import MuiTooltip from '@mui/material/Tooltip';
import { ReactElement, ReactNode } from 'react';

export const Tooltip = ({ label, children }: { label: string | ReactNode; children: ReactElement }) => {
	return <MuiTooltip title={label ? label : ''}>{children}</MuiTooltip>;
};
