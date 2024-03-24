import { Alert as MuiALert, AlertTitle, AlertColor } from '@mui/material';
import { PropsWithChildren, ReactNode } from 'react';

export const Alert = ({ title, severity, children }: PropsWithChildren<{ title?: string; severity?: AlertColor }>) => {
	return (
		<MuiALert severity={severity}>
			{!!title && <AlertTitle>{title}</AlertTitle>}
			{children}
		</MuiALert>
	);
};

export const TipAlert = ({ children }: { children: ReactNode }) => {
	return <Alert title="Tip">{children}</Alert>;
};
