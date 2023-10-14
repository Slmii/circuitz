import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from 'api/index';
import { QUERY_KEYS } from 'lib/constants/query-keys.constants';
import { Node } from 'lib/types';
import { useGetCircuit } from './useCircuits';
import { Principal } from '@dfinity/principal';

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

export const useAddNode = () => {
	const queryClient = useQueryClient();

	return useMutation(api.Nodes.addNode, {
		onSuccess: node => {
			// Add the new node to the circuit nodes cache
			queryClient.setQueryData<Node[]>([QUERY_KEYS.CIRCUIT_NODES, node.circuitId], nodes => [...(nodes ?? []), node]);
		}
	});
};
