import { Grid, Stack, Box } from '@mui/material';
import { CircuitCard } from 'components/CircuitCard';
import { IconButton } from 'components/IconButton';
import { Link } from 'components/Link';
import { Menu } from 'components/Menu';
import { SkeletonCircuitMetaData } from 'components/Skeleton';
import { B1, Caption, H2, H3 } from 'components/Typography';
import { useGetCircuitNodes, useGetCircuitTraces } from 'lib/hooks';
import { Circuit as ICircuit } from 'lib/types';
import { useMemo } from 'react';
import { CircuitStatus } from '../CircuitStatus';

export const Circuit = ({ circuit, onEdit }: { circuit: ICircuit; onEdit: () => void }) => {
	const { data: circuitNodes, isLoading: isCircuitNodesLoading } = useGetCircuitNodes(circuit.id);
	const { data: circuitTraces, isLoading: isCircuitTracesLoading } = useGetCircuitTraces(circuit.id);

	const errors = useMemo(() => {
		if (!circuitTraces) {
			return [];
		}

		return circuitTraces.filter(trace => trace.errors.filter(error => !error.resolvedAt));
	}, [circuitTraces]);

	const isLoaded = !!circuitNodes && !isCircuitNodesLoading && !!circuitTraces && !isCircuitTracesLoading;

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
					<H2 lineClamp={1}>{circuit.name}</H2>
				</Link>
				<B1
					textAlign="left"
					lineClamp={2}
					sx={{
						mt: 1,
						overflowWrap: 'anywhere'
					}}
					color="text.secondary"
				>
					{circuit.description}
				</B1>
				{isLoaded ? (
					<Stack
						direction="column"
						spacing={1}
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
						<CircuitStatus nodesCanisterId={circuitNodes.principal} />
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
				<H3>Create Circuit</H3>
			</CircuitCard>
		</Grid>
	);
};
