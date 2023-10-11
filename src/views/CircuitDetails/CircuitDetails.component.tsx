import { ButtonBase, Divider, Paper, Stack, Tab, Tabs } from '@mui/material';
import { B1, H1, H4, H5 } from 'components/Typography';
import { useGetCircuit, useGetCircuitNodes } from 'lib/hooks';
import { useParams } from 'react-router-dom';
import { CircuitStatus } from '../CircuitStatus';
import { formatTCycles } from 'lib/utils/ic.utils';
import { formatBytes } from 'lib/utils/number.utils';
import { toReadableDate } from 'lib/utils/date.utils';
import { StandaloneSwitch } from 'components/Form/Switch';
import { useState } from 'react';
import { Icon } from 'components/Icon';

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`
	};
}

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function CustomTabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && children}
		</div>
	);
}

export const Circuit = () => {
	const { id } = useParams();
	const [isActive, setIsActive] = useState(false);
	const [tab, setTab] = useState(0);

	const { data: circuitNodes, isLoading: isCircuitNodesLoading } = useGetCircuitNodes(id ? Number(id) : 0);
	const { data: circuit, isLoading: isCircuitLoading } = useGetCircuit(id ? Number(id) : 0);

	const handleOnTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTab(newValue);
	};

	const isLoaded = !!circuit && !isCircuitLoading && !!circuitNodes && !isCircuitNodesLoading;
	if (!isLoaded) {
		return <>Loading...</>;
	}

	return (
		<Paper
			sx={{
				width: '100%',
				height: 'calc(100vh - 65px)',
				backgroundColor: 'background.default',
				p: 6
			}}
		>
			<Stack direction="column" rowGap={2}>
				<H1>{circuit.name}</H1>
				<Tabs value={tab} onChange={handleOnTabChange} aria-label="basic tabs example">
					<Tab label="Nodes" {...a11yProps(0)} />
					<Tab label="Settings" {...a11yProps(1)} />
					<Tab label="History" {...a11yProps(2)} />
				</Tabs>
				<Stack direction="row" spacing={4}>
					<Stack
						sx={{
							flex: '1 1 70%',
							padding: 4,
							backgroundColor: 'background.paper',
							border: theme => `1px solid ${theme.palette.divider}`
						}}
					>
						<CustomTabPanel value={tab} index={0}>
							<Stack
								direction="row"
								alignItems="center"
								justifyContent="flex-start"
								component={ButtonBase}
								sx={{ p: 2, width: 600, backgroundColor: 'primary.main', color: 'primary.contrastText' }}
							>
								<Icon icon="add-outline" spacingRight fontSize="small" />
								<B1>Add Input Node</B1>
							</Stack>
						</CustomTabPanel>
						<CustomTabPanel value={tab} index={1}>
							Item Two
						</CustomTabPanel>
						<CustomTabPanel value={tab} index={2}>
							Item Three
						</CustomTabPanel>
					</Stack>
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
							nodesCanisterId={circuitNodes.principal}
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
				</Stack>
			</Stack>
		</Paper>
	);
};
