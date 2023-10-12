import { useRef } from 'react';

export const useFormSubmit = () => {
	const formRef = useRef<HTMLFormElement>(null);

	function submitter() {
		if (formRef.current) {
			formRef.current.dispatchEvent(new Event('submit', { bubbles: true }));
		}
	}

	return { formRef, submitter };
};
