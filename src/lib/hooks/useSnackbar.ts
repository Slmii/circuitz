import { SnackbarKey, useSnackbar as useNotistackSnackbar } from 'notistack';

export const useSnackbar = () => {
	const { enqueueSnackbar, closeSnackbar } = useNotistackSnackbar();

	return {
		errorSnackbar: (message: string) => enqueueSnackbar(message, { variant: 'error', persist: true }),
		successSnackbar: (message: string) => enqueueSnackbar(message, { variant: 'success' }),
		/**
		 * Close snackbar. If no key is provided, all snackbars will be closed.
		 */
		closeSnackbar: (key?: SnackbarKey) => closeSnackbar(key)
	};
};
