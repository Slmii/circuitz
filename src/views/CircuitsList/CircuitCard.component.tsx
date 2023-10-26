import { Grid, Stack, Chip, Paper, Skeleton } from '@mui/material';
import { IconButton } from 'components/IconButton';
import { Link } from 'components/Link';
import { Menu } from 'components/Menu';
import { B1, H3 } from 'components/Typography';
import { useGetCircuitTraces } from 'lib/hooks';
import { Circuit as ICircuit } from 'lib/types';
import { PropsWithChildren, useMemo } from 'react';
import { CircuitStatus } from '../CircuitStatus';
import pluralize from 'pluralize';

export const CircuitCard = ({ circuit, onEdit }: { circuit: ICircuit; onEdit: () => void }) => {
	const { data: circuitTraces, isLoading: isCircuitTracesLoading } = useGetCircuitTraces(circuit.id);

	const traces = useMemo(() => {
		if (!circuitTraces) {
			return [];
		}

		return circuitTraces.filter(trace => trace.errors.filter(error => !error.resolvedAt));
	}, [circuitTraces]);

	const isLoaded = !!circuitTraces && !isCircuitTracesLoading;

	return (
		<Grid item xs={12} sm={6} md={4}>
			<CircuitCardPaper>
				<Stack direction="column" spacing={2} width="100%">
					<Stack direction="row" alignItems="center" width="100%">
						<Link href={`/circuits/${circuit.id}`}>
							<H3 textAlign="left" lineClamp={1}>
								{circuit.name}
							</H3>
						</Link>
						<Chip
							label={circuit.isEnabled ? 'Active' : 'Inactive'}
							size="small"
							sx={{
								ml: 'auto',
								mr: 1,
								color: circuit.isEnabled ? 'success.light' : 'error.light',
								fontWeight: 'bold'
							}}
						/>
						<Menu
							label={<IconButton icon="more" />}
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
					</Stack>
					<Stack direction="column" spacing={1}>
						{isLoaded ? (
							<B1 color={traces.length ? 'error.main' : 'text.primary'}>
								{traces.length} {pluralize('error', traces.length)}
							</B1>
						) : (
							<Skeleton width="50%" variant="text" />
						)}
						<CircuitStatus nodesCanisterId={circuit.nodeCanisterId} />
					</Stack>
				</Stack>
			</CircuitCardPaper>
		</Grid>
	);
};

export const CircuitCardPaper = ({ children }: PropsWithChildren) => {
	return (
		<Paper
			elevation={0}
			sx={{
				display: 'flex',
				alignItems: 'flex-start',
				justifyContent: 'center',
				p: 2,
				width: '100%',
				border: theme => `1px solid ${theme.palette.divider}`
			}}
		>
			{children}
		</Paper>
	);
};
