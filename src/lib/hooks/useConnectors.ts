import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from 'api/index';
import { MUTATE_ERROR, QUERY_KEYS } from 'lib/constants';
import { useSnackbar } from './useSnackbar';
import { Connector } from 'lib/types';

export const useGetConnectors = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.CONNECTORS],
		queryFn: () => api.Connectors.getUserConnectors()
	});
};

export const useAddConnector = () => {
	const queryClient = useQueryClient();
	const { errorSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: api.Connectors.addConnector,
		onSuccess: connector => {
			queryClient.setQueryData<Connector[]>([QUERY_KEYS.CONNECTORS], old => {
				if (!old) {
					return [connector];
				}

				// Add the new connector
				return [...old, connector];
			});
		},
		onError: error => {
			console.error(error);
			errorSnackbar(MUTATE_ERROR);
		}
	});
};

export const useEditConnector = () => {
	const queryClient = useQueryClient();
	const { errorSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: api.Connectors.editConnector,
		onSuccess: connector => {
			queryClient.setQueryData<Connector[]>([QUERY_KEYS.CONNECTORS], connectors => {
				if (!connectors) {
					return [];
				}

				// Find the index of the node that was edited
				const index = connectors.findIndex(c => c.id === connector.id);
				// Replace the old node with the new one
				connectors[index] = connector;

				return connectors;
			});
		},
		onError: error => {
			console.error(error);
			errorSnackbar(MUTATE_ERROR);
		}
	});
};
