import { useState } from 'react';
import { useSnackbar } from './useSnackbar';

type CopiedValue = string | null;
type CopyFn = (text: string) => Promise<boolean>; // Return success

export function useCopyToClipboard(): { copiedText: CopiedValue; copy: CopyFn } {
	const { successSnackbar, errorSnackbar, closeSnackbar } = useSnackbar();
	const [copiedText, setCopiedText] = useState<CopiedValue>(null);

	const copy: CopyFn = async text => {
		closeSnackbar();

		if (!navigator?.clipboard) {
			errorSnackbar('Clipboard not supported');
			return false;
		}

		// Try to save to clipboard then save it in the state if worked
		try {
			await navigator.clipboard.writeText(text);
			setCopiedText(text);

			successSnackbar('Copied to clipboard');

			return true;
		} catch (error) {
			console.warn('Copy failed', error);
			setCopiedText(null);
			return false;
		}
	};

	return { copiedText, copy };
}
