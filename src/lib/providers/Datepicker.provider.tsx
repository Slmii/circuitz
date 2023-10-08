import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { PropsWithChildren } from 'react';

export const DatepickerProvider = ({ children }: PropsWithChildren) => {
	return <LocalizationProvider dateAdapter={AdapterDateFns}>{children}</LocalizationProvider>;
};
