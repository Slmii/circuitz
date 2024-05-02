import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from 'api/index';
import { QUERY_KEYS, MUTATE_ERROR } from 'lib/constants';
import { Circuit } from 'lib/types';
import { useSnackbar } from './useSnackbar';
import { Principal } from '@dfinity/principal';

export const useAddCircuit = () => {
	const queryClient = useQueryClient();
	const { errorSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: api.Circuits.addCircuit,
		onSuccess: circuit => {
			queryClient.setQueryData<Circuit[]>([QUERY_KEYS.CIRCUITS], old => {
				if (!old) {
					return [circuit];
				}

				// Add the new circuit to the top of the list
				return [circuit, ...old];
			});
		},
		onError: error => {
			console.error(error);
			errorSnackbar(MUTATE_ERROR);
		}
	});
};

export const useEditCircuit = () => {
	const queryClient = useQueryClient();
	const { errorSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: api.Circuits.editCircuit,
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

			queryClient.setQueryData<Circuit>([QUERY_KEYS.CIRCUIT, circuit.id], old => {
				if (!old) {
					return;
				}

				return {
					...old,
					...circuit
				};
			});
		},
		onError: error => {
			console.error(error);
			errorSnackbar(MUTATE_ERROR);
		}
	});
};

export const useToggleCircuitStatus = () => {
	const queryClient = useQueryClient();
	const { errorSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: api.Circuits.toggleStatus,
		onMutate: ({ circuitId, enabled }) => {
			// Snapshot
			const previousCircuit = queryClient.getQueryData([QUERY_KEYS.CIRCUIT, circuitId]);
			const previousCircuits = queryClient.getQueryData([QUERY_KEYS.CIRCUITS]);

			// Optimistic updates
			queryClient.setQueryData<Circuit>([QUERY_KEYS.CIRCUIT, circuitId], old => {
				if (!old) {
					return;
				}

				return { ...old, isEnabled: !enabled };
			});

			queryClient.setQueryData<Circuit[]>([QUERY_KEYS.CIRCUITS], old => {
				if (!old) {
					return;
				}

				// Find the index of the circuit that was edited
				const index = old.findIndex(c => c.id === circuitId);

				// Replace the old circuit with the new one
				old[index].isEnabled = !enabled;

				return old;
			});

			return {
				previousCircuit,
				previousCircuits
			};
		},
		onError: (error, variables, context) => {
			console.error(error);
			errorSnackbar(MUTATE_ERROR);

			// Rollback
			if (context?.previousCircuit) {
				queryClient.setQueryData([QUERY_KEYS.CIRCUIT, variables.circuitId], context.previousCircuit);
			}

			if (context?.previousCircuits) {
				queryClient.setQueryData([QUERY_KEYS.CIRCUITS], context.previousCircuits);
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
