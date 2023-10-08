import { useRef } from 'react';

export const useDialogFormSubmit = () => {
	const formRef = useRef<HTMLFormElement>(null);

	function handleSubmit() {
		if (formRef.current) {
			formRef.current.dispatchEvent(new Event('submit', { bubbles: true }));
		}
	}

	return { formRef, handleSubmit };
};
