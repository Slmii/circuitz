import { Button } from 'components/Button';
import { AUTO_HIDE_DURATION } from 'lib/constants/snackbar.constants';
import { SnackbarProvider as NotistackSnackbarProvider, closeSnackbar } from 'notistack';
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
			action={snackbarId => (
				<Button color="inherit" sx={{ fontSize: 10 }} onClick={() => closeSnackbar(snackbarId)}>
					Dismiss
				</Button>
			)}
		>
			{children}
		</NotistackSnackbarProvider>
	);
};
