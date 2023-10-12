import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from 'api/index';
import { QUERY_KEYS } from 'lib/constants/query-keys.constants';

export const useGetCircuitNodes = (circuitId: number) => {
	return useQuery({
		queryKey: [QUERY_KEYS.CIRCUIT_NODES],
		enabled: !!circuitId,
		queryFn: () => api.Nodes.getNodes(circuitId)
	});
};

export const useGetNodeCanisterId = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.NODE_CANISTER_ID],
		queryFn: () => api.Nodes.getNodeCanisterId()
	});
};

export const useAddNode = () => {
	return useMutation(api.Nodes.addNode);
};
