import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from 'api/index';
import { QUERY_KEYS } from 'lib/constants/query-keys.constants';
import { Circuit } from 'lib/types';
import { useSnackbar } from './useSnackbar';
import { Principal } from '@dfinity/principal';

export const useAddCircuit = () => {
	const queryClient = useQueryClient();
	const { errorSnackbar } = useSnackbar();

	return useMutation(api.Circuits.addCircuit, {
		onSuccess: circuit => {
			queryClient.setQueryData<Circuit[]>([QUERY_KEYS.CIRCUITS], old => {
				if (!old) {
					return [circuit];
				}

				// Add the new circuit to the top of the list
				return [circuit, ...old];
			});
		},
		onError: () => {
			errorSnackbar('Failed to add circuit');
		}
	});
};

export const useEditCircuit = () => {
	const queryClient = useQueryClient();
	const { errorSnackbar } = useSnackbar();

	return useMutation(api.Circuits.editCircuit, {
		onSuccess: circuit => {
			queryClient.setQueryData<Circuit[]>([QUERY_KEYS.CIRCUITS], old => {
				if (!old) {
					return [];
				}

				// Find the index of the circuit that was edited
				const index = old.findIndex(c => c.id === circuit.id);
				// Replace the old circuit with the new one
				old[index] = circuit;

				return old;
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

export const useGetCircuit = (circuitId: number) => {
	return useQuery({
		queryKey: [QUERY_KEYS.CIRCUIT, circuitId],
		enabled: !!circuitId,
		queryFn: () => api.Circuits.getCircuit(circuitId)
	});
};

export const useGetCircuitStatus = (canisterId: Principal) => {
	return useQuery({
		queryKey: [QUERY_KEYS.CANISTER_STATUS, canisterId.toString()],
		queryFn: () => api.IC.getCanisterStatus(canisterId)
	});
};
