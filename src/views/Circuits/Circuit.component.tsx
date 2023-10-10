import { Grid, Stack, Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { api } from 'api/index';
import { CircuitCard } from 'components/CircuitCard';
import { IconButton } from 'components/IconButton';
import { Link } from 'components/Link';
import { Menu } from 'components/Menu';
import { Caption, SubTitle } from 'components/Typography';
import { QUERY_KEYS } from 'lib/constants/query-keys.constants';
import { useGetCircuitNodes } from 'lib/hooks/useNodes';
import { Circuit as ICircuit } from 'lib/types';
import { formatTCycles } from 'lib/utils/ic.utils';
import { formatBytes } from 'lib/utils/number.utils';

export const Circuit = ({ circuit, onEdit }: { circuit: ICircuit; onEdit: () => void }) => {
	const { data: circuitNodes, isLoading: isCircuitNodesLoading } = useGetCircuitNodes(circuit.id);
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

	const isLoaded = !!circuitNodes && !isCircuitNodesLoading && !!canisterStatus && !isCanisterStatusLoading;

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
				<Stack direction="column" spacing={1}>
					<Link href={`/circuits/${circuit.id}`}>
						<SubTitle>{circuit.name}</SubTitle>
					</Link>
					{isLoaded && (
						<Stack direction="column" alignItems="center">
							<Caption color="text.secondary">{formatTCycles(canisterStatus.cycles)}T Cycles</Caption>
							<Caption color="text.secondary" textTransform="capitalize">
								{canisterStatus.status}
							</Caption>
							<Caption color="text.secondary">{formatBytes(Number(canisterStatus.memory_size))}</Caption>
						</Stack>
					)}
				</Stack>
				<Stack
					direction="row"
					spacing={1}
					sx={{ position: 'absolute', bottom: theme => theme.spacing(2), left: theme => theme.spacing(2) }}
				>
					<Box sx={{ width: 24, height: 24, backgroundColor: 'error.dark', borderRadius: '50%' }} />
					<Caption color="error.main">25 errors</Caption>
				</Stack>
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
