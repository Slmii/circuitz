import { useQuery } from '@tanstack/react-query';
import { api } from 'api/index';
import { QUERY_KEYS } from 'lib/constants';

export const useGetCircuitTraces = (circuitId: number) => {
	return useQuery({
		queryKey: [QUERY_KEYS.CIRCUIT_TRACES, circuitId],
		queryFn: () => api.Traces.getTraces(circuitId)
	});
};
