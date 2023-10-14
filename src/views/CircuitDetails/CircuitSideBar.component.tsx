import { Stack, Divider, Skeleton } from '@mui/material';
import { StandaloneSwitch } from 'components/Form/Switch';
import { H4, H5, B1 } from 'components/Typography';
import { toReadableDate } from 'lib/utils/date.utils';
import { formatTCycles } from 'lib/utils/ic.utils';
import { formatBytes } from 'lib/utils/number.utils';
import { CircuitStatus } from '../CircuitStatus';
import { Circuit } from 'lib/types';
import { Principal } from '@dfinity/principal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api/index';
import { QUERY_KEYS } from 'lib/constants/query-keys.constants';
import { useSnackbar } from 'lib/hooks';

export const CircuitSideBar = ({ circuit, nodeCanisterId }: { circuit: Circuit; nodeCanisterId: Principal }) => {
	const { errorSnackbar } = useSnackbar();
	const queryClient = useQueryClient();

	const { mutate } = useMutation(api.Circuits.toggleStatus, {
		onMutate: () => {
			// Snapshot
			const previousCircuit = queryClient.getQueryData([QUERY_KEYS.CIRCUIT, circuit.id]);

			// Optimistic update
			queryClient.setQueryData([QUERY_KEYS.CIRCUIT, circuit.id], { ...circuit, isEnabled: !circuit.isEnabled });

			return {
				previousCircuit
			};
		},
		onError: (_error, _variables, context) => {
			errorSnackbar('Something went wrong');

			// Rollback
			if (context?.previousCircuit) {
				queryClient.setQueryData([QUERY_KEYS.CIRCUIT, circuit.id], context.previousCircuit);
			}
		}
	});

	return (
		<Stack
			direction="column"
			spacing={4}
			sx={{
				flex: '1 1 30%',
				padding: 4,
				backgroundColor: 'background.paper',
				border: theme => `1px solid ${theme.palette.divider}`,
				borderRadius: 1
			}}
		>
			<Stack
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				sx={{ p: 2, backgroundColor: 'primary.main', color: 'primary.contrastText', borderRadius: 1 }}
			>
				<H4>{circuit.isEnabled ? 'Active' : 'Inactive'}</H4>
				<StandaloneSwitch
					value={circuit.isEnabled}
					name="active"
					onChange={() => mutate({ circuitId: circuit.id, enabled: circuit.isEnabled })}
				/>
			</Stack>
			<Stack direction="column" spacing={2}>
				<Stack direction="column" spacing={1}>
					<H5 fontWeight="bold">Last updated at</H5>
					<B1>{toReadableDate(circuit.updatedAt, { includeTime: true })}</B1>
				</Stack>
				<Stack direction="column" spacing={1}>
					<H5 fontWeight="bold">Last run at</H5>
					<B1>{circuit.runAt ? toReadableDate(circuit.runAt, { includeTime: true }) : '-'}</B1>
				</Stack>
			</Stack>
			<Divider />
			<CircuitStatus
				nodesCanisterId={nodeCanisterId}
				render={data => (
					<>
						{!!data.data && !data.isLoading ? (
							<Stack direction="column" spacing={2}>
								<Stack direction="column" spacing={1}>
									<H5 fontWeight="bold">Cycles</H5>
									<B1>{formatTCycles(data.data.cycles)} T</B1>
								</Stack>
								<Stack direction="column" spacing={1}>
									<H5 fontWeight="bold">Status</H5>
									<B1 textTransform="capitalize">{data.data.status}</B1>
								</Stack>
								<Stack direction="column" spacing={1}>
									<H5 fontWeight="bold">Memory</H5>
									<B1>{formatBytes(Number(data.data.memory_size))}</B1>
								</Stack>
							</Stack>
						) : (
							<Stack direction="column" spacing={2}>
								<Stack direction="column" spacing={1}>
									<Skeleton variant="text" />
									<Skeleton variant="text" />
								</Stack>
								<Stack direction="column" spacing={1}>
									<Skeleton variant="text" />
									<Skeleton variant="text" />
								</Stack>
								<Stack direction="column" spacing={1}>
									<Skeleton variant="text" />
									<Skeleton variant="text" />
								</Stack>
							</Stack>
						)}
					</>
				)}
			/>
			<Divider />
			<Stack direction="column" spacing={1}>
				<H5 fontWeight="bold">Description</H5>
				<B1>{circuit.description.length ? circuit.description : '-'}</B1>
			</Stack>
		</Stack>
	);
};
