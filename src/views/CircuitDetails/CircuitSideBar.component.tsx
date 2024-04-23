import { Stack, Divider, Skeleton } from '@mui/material';
import { StandaloneSwitch } from 'components/Form/Switch';
import { H4, H5, B1, H1 } from 'components/Typography';
import { toReadableDate, formatTCycles, formatBytes } from 'lib/utils';
import { CircuitStatus } from '../CircuitStatus';
import { Circuit } from 'lib/types';
import { Principal } from '@dfinity/principal';
import { useToggleCircuitStatus } from 'lib/hooks';

export const CircuitSideBar = ({ circuit, nodeCanisterId }: { circuit: Circuit; nodeCanisterId: Principal }) => {
	const { mutate } = useToggleCircuitStatus();

	return (
		<Stack
			direction="column"
			spacing={4}
			sx={{
				flex: '1 1 20%',
				height: 'calc(100vh - 65px)',
				overflowY: 'auto',
				borderLeft: theme => `1px solid ${theme.palette.divider}`,
				padding: 4,
				backgroundColor: 'background.paper'
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
				<H1>{circuit.name}</H1>
				{circuit.description.length ? <B1>{circuit.description}</B1> : null}
			</Stack>
			<Divider />
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
									<H5 fontWeight="bold">Canister</H5>
									<B1>{nodeCanisterId.toString()}</B1>
								</Stack>
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
		</Stack>
	);
};
