import { Grid, Stack, Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { api } from 'api/index';
import { CircuitCard } from 'components/CircuitCard';
import { IconButton } from 'components/IconButton';
import { Link } from 'components/Link';
import { Menu } from 'components/Menu';
import { SkeletonCircuitMetaData } from 'components/Skeleton';
import { Caption, SubTitle } from 'components/Typography';
import { QUERY_KEYS } from 'lib/constants/query-keys.constants';
import { useGetCircuitNodes, useGetCircuitTraces } from 'lib/hooks';
import { Circuit as ICircuit } from 'lib/types';
import { formatTCycles } from 'lib/utils/ic.utils';
import { formatBytes } from 'lib/utils/number.utils';
import { useMemo } from 'react';

export const Circuit = ({ circuit, onEdit }: { circuit: ICircuit; onEdit: () => void }) => {
	const { data: circuitNodes, isLoading: isCircuitNodesLoading } = useGetCircuitNodes(circuit.id);
	const { data: circuitTraces, isLoading: isCircuitTracesLoading } = useGetCircuitTraces(circuit.id);

	const { data: canisterStatus, isLoading: isCanisterStatusLoading } = useQuery({
		queryKey: [QUERY_KEYS.CANISTER_STATUS, circuit.id],
		enabled: !!circuitNodes,
		queryFn: () => {
			if (!circuitNodes) {
				return;
			}

			return api.IC.getCanisterStatus(circuitNodes.principal);
		}
	});

	const errors = useMemo(() => {
		if (!circuitTraces) {
			return [];
		}

		return circuitTraces.filter(trace => trace.errors.filter(error => !error.resolvedAt));
	}, [circuitTraces]);

	const isLoaded =
		!!circuitNodes &&
		!isCircuitNodesLoading &&
		!!canisterStatus &&
		!isCanisterStatusLoading &&
		!!circuitTraces &&
		!isCircuitTracesLoading;

	return (
		<Grid item xs={12} sm={6} md={4}>
			<CircuitCard>
				<Menu
					label={
						<IconButton
							sx={{
								position: 'absolute',
								top: theme => theme.spacing(2),
								right: theme => theme.spacing(2)
							}}
							icon="more"
							size="small"
						/>
					}
					id="circuit-menu"
					menu={[
						{
							id: 'edit',
							label: 'Edit',
							icon: 'edit',
							action: onEdit
						},
						{
							id: 'clone',
							label: 'Clone',
							icon: 'copy'
						},
						{
							id: 'delete',
							label: 'Delete',
							color: 'error',
							icon: 'trash'
						}
					]}
				/>
				<Link href={`/circuits/${circuit.id}`}>
					<SubTitle lineClamp={1}>{circuit.name}</SubTitle>
				</Link>
				<Caption
					textAlign="left"
					lineClamp={2}
					sx={{
						mt: 1,
						overflowWrap: 'anywhere'
					}}
					color="text.secondary"
				>
					{circuit.description}
				</Caption>
				{isLoaded ? (
					<Stack
						direction="column"
						sx={{ position: 'absolute', bottom: theme => theme.spacing(2), left: theme => theme.spacing(2) }}
					>
						<Stack direction="row" spacing={1} alignItems="center" height={24}>
							<Box
								sx={{
									width: 20,
									height: 20,
									backgroundColor: errors.length ? 'error.dark' : 'success.dark',
									borderRadius: '50%'
								}}
							/>
							{errors.length ? <Caption color="error.main">{errors.length} errors</Caption> : null}
						</Stack>
						<Stack direction="row" spacing={0.5} alignItems="center">
							<Caption color="text.secondary">{formatTCycles(canisterStatus.cycles)} T Cycles</Caption>
							<span>·</span>
							<Caption color="text.secondary" textTransform="capitalize">
								{canisterStatus.status}
							</Caption>
							<span>·</span>
							<Caption color="text.secondary">{formatBytes(Number(canisterStatus.memory_size))}</Caption>
						</Stack>
					</Stack>
				) : (
					<SkeletonCircuitMetaData />
				)}
			</CircuitCard>
		</Grid>
	);
};

export const CreateCircuit = ({ onClick }: { onClick: () => void }) => {
	return (
		<Grid item xs={12} sm={6} md={4}>
			<CircuitCard onClick={onClick}>
				<SubTitle>Create Circuit</SubTitle>
			</CircuitCard>
		</Grid>
	);
};
