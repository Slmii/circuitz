import DOMPurify from 'dompurify';

export const useFormat = () => {
	return {
		sanitize: (value: string) => DOMPurify.sanitize(value)
	};
};
