import { useEffect } from 'react';

export const useDisableScroll = (disable: boolean) => {
	useEffect(() => {
		if (disable) {
			// Disable scroll when open
			document.body.style.overflow = 'hidden';
		} else {
			// Enable scroll when closed
			document.body.style.overflow = 'auto';
		}
	}, [disable]);
};
