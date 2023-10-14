import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from 'api/index';
import { QUERY_KEYS, MUTATE_ERROR } from 'lib/constants';
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
			errorSnackbar(MUTATE_ERROR);
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
			errorSnackbar(MUTATE_ERROR);
		}
	});
};

export const useToggleCircuitStatus = () => {
	const queryClient = useQueryClient();
	const { errorSnackbar } = useSnackbar();

	return useMutation(api.Circuits.toggleStatus, {
		onMutate: ({ circuitId, enabled }) => {
			// Snapshot
			const previousCircuit = queryClient.getQueryData([QUERY_KEYS.CIRCUIT, circuitId]);

			// Optimistic update
			queryClient.setQueryData<Circuit>([QUERY_KEYS.CIRCUIT, circuitId], old => {
				if (!old) {
					return;
				}

				return { ...old, isEnabled: !enabled };
			});

			return {
				previousCircuit
			};
		},
		onError: (_error, variables, context) => {
			errorSnackbar(MUTATE_ERROR);

			// Rollback
			if (context?.previousCircuit) {
				queryClient.setQueryData([QUERY_KEYS.CIRCUIT, variables.circuitId], context.previousCircuit);
			}
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
