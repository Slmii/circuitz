import { Principal } from '@dfinity/principal';
import { Stack } from '@mui/material';
import { SkeletonCircuitStatus } from 'components/Skeleton';
import { Spacer } from 'components/Spacer';
import { Caption } from 'components/Typography';
import { useGetCircuitStatus } from 'lib/hooks';
import { formatTCycles, formatBytes } from 'lib/utils';
import { ReactNode } from 'react';

export const CircuitStatus = ({
	nodesCanisterId,
	render
}: {
	nodesCanisterId: Principal;
	render?: (data: ReturnType<typeof useGetCircuitStatus>) => ReactNode;
}) => {
	const data = useGetCircuitStatus(nodesCanisterId);

	if (render) {
		return <>{render(data)}</>;
	}

	const isLoaded = !!data.data && !data.isLoading;
	if (!isLoaded) {
		return <SkeletonCircuitStatus />;
	}

	return (
		<Stack direction="row" spacing={1} alignItems="center">
			<Caption color="text.secondary">{formatTCycles(data.data.cycles)} T Cycles</Caption>
			<Spacer />
			<Caption color="text.secondary" textTransform="capitalize">
				{data.data.status}
			</Caption>
			<Spacer />
			<Caption color="text.secondary">{formatBytes(Number(data.data.memory_size))}</Caption>
		</Stack>
	);
};
