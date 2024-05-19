import { Button } from 'components/Button';
import { SnackbarProvider as NotistackSnackbarProvider, closeSnackbar } from 'notistack';
import { PropsWithChildren } from 'react';

export const SnackbarProvider = ({ children }: PropsWithChildren) => {
	return (
		<NotistackSnackbarProvider
			maxSnack={4}
			autoHideDuration={5000}
			action={snackbarId => (
				<Button color="inherit" onClick={() => closeSnackbar(snackbarId)}>
					Dismiss
				</Button>
			)}
		>
			{children}
		</NotistackSnackbarProvider>
	);
};
