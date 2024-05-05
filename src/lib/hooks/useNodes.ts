import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from 'api/index';
import { QUERY_KEYS, MUTATE_ERROR } from 'lib/constants';
import { CustomUseQueryOptions, Node, SampleData } from 'lib/types';
import { useSnackbar } from './useSnackbar';
import { useGetCircuit } from './useCircuits';
import { Principal } from '@dfinity/principal';
import { useGetParam } from './useGetParam';

export const useGetCircuitNode = (nodeId: number) => {
	return useQuery({
		queryKey: [QUERY_KEYS.CIRCUIT_NODE, nodeId],
		enabled: !!nodeId,
		queryFn: () => api.Nodes.getNode(nodeId)
	});
};

export const useGetCircuitNodes = (circuitId: number) => {
	return useQuery({
		queryKey: [QUERY_KEYS.CIRCUIT_NODES, circuitId],
		enabled: !!circuitId,
		queryFn: () => api.Nodes.getNodes(circuitId)
	});
};

export const useGetSampleData = (
	{
		circuitId,
		nodes
	}: {
		circuitId: number;
		nodes: Node[];
	},
	options?: CustomUseQueryOptions<SampleData>
) => {
	return useQuery({
		queryKey: [QUERY_KEYS.SAMPLE_DATA, circuitId, nodes.map(node => node.id)],
		queryFn: () => api.Nodes.getSampleData(nodes),
		...options
	});
};

export const useGetNodeCanisterId = (circuitId: number) => {
	const { data: circuit } = useGetCircuit(circuitId);
	return circuit?.nodeCanisterId ?? Principal.anonymous();
};

export const useDeleteNode = () => {
	const { errorSnackbar } = useSnackbar();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: api.Nodes.deleteNode,
		onSuccess: node => {
			queryClient.setQueryData<Node[]>([QUERY_KEYS.CIRCUIT_NODES, node.circuitId], nodes => {
				if (!nodes) {
					return [];
				}

				return nodes.filter(n => n.id !== node.id);
			});
		},
		onError: error => {
			console.error(error);
			errorSnackbar(MUTATE_ERROR);
		}
	});
};

export const useAddNode = () => {
	const { errorSnackbar } = useSnackbar();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: api.Nodes.addNode,
		onSuccess: node => {
			// Add the new node to the circuit nodes cache
			queryClient.setQueryData<Node[]>([QUERY_KEYS.CIRCUIT_NODES, node.circuitId], nodes => [...(nodes ?? []), node]);
		},
		onError: error => {
			console.error(error);
			errorSnackbar(MUTATE_ERROR);
		}
	});
};

export const useEditNode = () => {
	const { errorSnackbar } = useSnackbar();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: api.Nodes.editNode,
		onSuccess: node => {
			// Update the node to the circuit nodes cache
			queryClient.setQueryData<Node[]>([QUERY_KEYS.CIRCUIT_NODES, node.circuitId], nodes => {
				if (!nodes) {
					return [];
				}

				// Find the index of the node that was edited
				const index = nodes.findIndex(n => n.id === node.id);
				// Replace the old node with the new one
				nodes[index] = node;

				return nodes;
			});
		},
		onError: error => {
			console.error(error);
			errorSnackbar(MUTATE_ERROR);
		}
	});
};

export const useAddPin = () => {
	const { errorSnackbar } = useSnackbar();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: api.Nodes.addPin,
		onSuccess: node => {
			// Add the new pin to the nodes cache
			queryClient.setQueryData<Node[]>([QUERY_KEYS.CIRCUIT_NODES, node.circuitId], old => {
				if (!old) {
					return [];
				}

				// Find the index of the node that was edited
				const index = old.findIndex(n => n.id === node.id);
				// Replace the old node with the new one
				old[index] = node;

				return old;
			});
		},
		onError: error => {
			console.error(error);
			errorSnackbar(MUTATE_ERROR);
		}
	});
};

export const useEditPin = () => {
	const { errorSnackbar } = useSnackbar();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: api.Nodes.editPin,
		onSuccess: node => {
			// Edit pin in the nodes cache
			queryClient.setQueryData<Node[]>([QUERY_KEYS.CIRCUIT_NODES, node.circuitId], old => {
				if (!old) {
					return [];
				}

				// Find the index of the node that was edited
				const index = old.findIndex(n => n.id === node.id);
				// Replace the old node with the new one
				old[index] = node;

				return old;
			});
		},
		onError: error => {
			console.error(error);
			errorSnackbar(MUTATE_ERROR);
		}
	});
};

export const useDeletePin = () => {
	const { errorSnackbar } = useSnackbar();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: api.Nodes.deletePin,
		onSuccess: node => {
			// Add the new pin to the nodes cache
			queryClient.setQueryData<Node[]>([QUERY_KEYS.CIRCUIT_NODES, node.circuitId], old => {
				if (!old) {
					return [];
				}

				// Find the index of the node that was deleted
				const index = old.findIndex(n => n.id === node.id);
				// Replace the old node with the new one
				old[index] = node;

				return old;
			});
		},
		onError: error => {
			console.error(error);
			errorSnackbar(MUTATE_ERROR);
		}
	});
};

export const useLookupCanisterPreview = () => {
	const queryClient = useQueryClient();

	const circuitId = useGetParam('circuitId');
	const canisterId = useGetNodeCanisterId(Number(circuitId));

	return useMutation({
		mutationFn: api.Nodes.previewLookupCanister,
		onSettled: () => {
			// Clear the cache
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CANISTER_STATUS, canisterId.toString()] });
		}
	});
};

export const useLookupHttpRequestPreview = () => {
	const queryClient = useQueryClient();

	const circuitId = useGetParam('circuitId');
	const canisterId = useGetNodeCanisterId(Number(circuitId));

	return useMutation({
		mutationFn: api.Nodes.previewLookupHTTPRequest,
		onSettled: () => {
			// Clear the cache
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CANISTER_STATUS, canisterId.toString()] });
		}
	});
};

export const useToggleNodeStatus = () => {
	const queryClient = useQueryClient();
	const { errorSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: api.Nodes.toggleStatus,
		onMutate: ({ nodeId, circuitId, enabled }) => {
			// Snapshot
			const previousCircuitNodes = queryClient.getQueryData([QUERY_KEYS.CIRCUIT_NODES, circuitId]);

			// Optimistic updates
			queryClient.setQueryData<Node[]>([QUERY_KEYS.CIRCUIT_NODES, circuitId], old => {
				if (!old) {
					return [];
				}

				// Find the index of the node that was edited
				const index = old.findIndex(node => node.id === nodeId);

				// Replace the old node with the new one
				old[index].isEnabled = !enabled;

				return old;
			});

			return {
				previousCircuitNodes
			};
		},
		onError: (error, variables, context) => {
			console.error(error);
			errorSnackbar(MUTATE_ERROR);

			// Rollback
			if (context?.previousCircuitNodes) {
				queryClient.setQueryData([QUERY_KEYS.CIRCUIT_NODES, variables.circuitId], context.previousCircuitNodes);
			}
		}
	});
};
