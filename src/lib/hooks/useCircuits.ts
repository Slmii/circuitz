import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from 'api/index';
import { QUERY_KEYS } from 'lib/constants/query-keys.constants';
import { Circuit } from 'lib/types';
import { useSnackbar } from './useSnackbar';

export const useAddCircuit = () => {
	const queryClient = useQueryClient();
	const { errorSnackbar } = useSnackbar();

	return useMutation(api.Circuits.addCircuit, {
		onSuccess: circuit => {
			queryClient.setQueryData<Circuit[]>([QUERY_KEYS.CIRCUITS], old => {
				if (!old) {
					return [circuit];
				}

				return [circuit, ...old];
			});
		},
		onError: () => {
			errorSnackbar('Failed to add circuit');
		}
	});
};

export const useGetCircuits = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.CIRCUITS],
		queryFn: () => api.Circuits.getUserCircuits()
	});
};
