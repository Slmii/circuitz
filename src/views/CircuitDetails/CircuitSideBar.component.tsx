import { Stack, Divider } from '@mui/material';
import { StandaloneSwitch } from 'components/Form/Switch';
import { H4, H5, B1 } from 'components/Typography';
import { toReadableDate } from 'lib/utils/date.utils';
import { formatTCycles } from 'lib/utils/ic.utils';
import { formatBytes } from 'lib/utils/number.utils';
import { CircuitStatus } from '../CircuitStatus';
import { useState } from 'react';
import { Circuit } from 'lib/types';
import { Principal } from '@dfinity/principal';

export const CircuitSideBar = ({ circuit, nodeCanisterId }: { circuit: Circuit; nodeCanisterId: Principal }) => {
	const [isActive, setIsActive] = useState(false);

	return (
		<Stack
			direction="column"
			spacing={4}
			sx={{
				flex: '1 1 30%',
				padding: 4,
				backgroundColor: 'background.paper',
				border: theme => `1px solid ${theme.palette.divider}`
			}}
		>
			<Stack
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				sx={{ p: 2, backgroundColor: 'primary.main', color: 'primary.contrastText' }}
			>
				<H4>{isActive ? 'Active' : 'Inactive'}</H4>
				<StandaloneSwitch value={isActive} name="active" onChange={setIsActive} />
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
						{data.data && (
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
