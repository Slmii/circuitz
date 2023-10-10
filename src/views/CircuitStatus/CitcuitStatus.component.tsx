import { Principal } from '@dfinity/principal';
import { Stack } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { api } from 'api/index';
import { SkeletonCircuitStatus } from 'components/Skeleton';
import { Spacer } from 'components/Spacer';
import { Caption } from 'components/Typography';
import { QUERY_KEYS } from 'lib/constants/query-keys.constants';
import { formatTCycles } from 'lib/utils/ic.utils';
import { formatBytes } from 'lib/utils/number.utils';

export const CircuitData = ({ nodesPrincipal }: { nodesPrincipal: Principal }) => {
	const { data: canisterStatus, isLoading: isCanisterStatusLoading } = useQuery({
		queryKey: [QUERY_KEYS.CANISTER_STATUS, nodesPrincipal.toString()],
		queryFn: () => api.IC.getCanisterStatus(nodesPrincipal)
	});

	const isLoaded = !!canisterStatus && !isCanisterStatusLoading;
	if (!isLoaded) {
		return <SkeletonCircuitStatus />;
	}

	return (
		<Stack direction="row" spacing={1} alignItems="center">
			<Caption color="text.secondary">{formatTCycles(canisterStatus.cycles)} T Cycles</Caption>
			<Spacer />
			<Caption color="text.secondary" textTransform="capitalize">
				{canisterStatus.status}
			</Caption>
			<Spacer />
			<Caption color="text.secondary">{formatBytes(Number(canisterStatus.memory_size))}</Caption>
		</Stack>
	);
};
