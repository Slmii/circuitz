import { AUTO_HIDE_DURATION } from 'lib/constants/snackbar.constants';
import { SnackbarProvider as NotistackSnackbarProvider } from 'notistack';
import { PropsWithChildren } from 'react';

export const SnackbarProvider = ({ children }: PropsWithChildren) => {
	return (
		<NotistackSnackbarProvider
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right'
			}}
			maxSnack={4}
			autoHideDuration={AUTO_HIDE_DURATION}
		>
			{children}
		</NotistackSnackbarProvider>
	);
};
