import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from 'api/index';
import { QUERY_KEYS, MUTATE_ERROR } from 'lib/constants';
import { Node } from 'lib/types';
import { useGetCircuit } from './useCircuits';
import { Principal } from '@dfinity/principal';
import { useSnackbar } from './useSnackbar';

export const useGetCircuitNodes = (circuitId: number) => {
	return useQuery({
		queryKey: [QUERY_KEYS.CIRCUIT_NODES, circuitId],
		enabled: !!circuitId,
		queryFn: () => api.Nodes.getNodes(circuitId)
	});
};

export const useGetNodeCanisterId = (circuitId: number) => {
	const { data: circuit } = useGetCircuit(circuitId);
	return circuit?.nodeCanisterId ?? Principal.anonymous();
};

export const useDeleteNode = () => {
	const { errorSnackbar } = useSnackbar();
	const queryClient = useQueryClient();

	return useMutation(api.Nodes.deleteNode, {
		onSuccess: node => {
			queryClient.setQueryData<Node[]>([QUERY_KEYS.CIRCUIT_NODES, node.circuitId], nodes => {
				if (!nodes) {
					return [];
				}

				return nodes.filter(n => n.id !== node.id);
			});
		},
		onError: () => {
			errorSnackbar(MUTATE_ERROR);
		}
	});
};

export const useAddNode = () => {
	const { errorSnackbar } = useSnackbar();
	const queryClient = useQueryClient();

	return useMutation(api.Nodes.addNode, {
		onSuccess: node => {
			// Add the new node to the circuit nodes cache
			queryClient.setQueryData<Node[]>([QUERY_KEYS.CIRCUIT_NODES, node.circuitId], nodes => [...(nodes ?? []), node]);
		},
		onError: () => {
			errorSnackbar(MUTATE_ERROR);
		}
	});
};

export const useEditNode = () => {
	const { errorSnackbar } = useSnackbar();
	const queryClient = useQueryClient();

	return useMutation(api.Nodes.editNode, {
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
		onError: () => {
			errorSnackbar(MUTATE_ERROR);
		}
	});
};

export const usePreview = () => {
	return useMutation(api.Nodes.previewLookupCanister);
};
