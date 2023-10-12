import { useParams } from 'react-router-dom';

export const useGetParam = (param: string): string => {
	const params = useParams();

	if (!params[param]) {
		throw new Error(`Missing param: ${param}`);
	}

	return params[param] as string;
};
