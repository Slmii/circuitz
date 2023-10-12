import { Paper, Stack, Tab, Tabs } from '@mui/material';
import { H1 } from 'components/Typography';
import { useGetCircuit, useGetCircuitNodes } from 'lib/hooks';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Breadcrumbs } from 'components/Breadcrumbs';
import { CircuitSideBar } from './CircuitSideBar.component';
import { CircuitNodes } from './CircuitNodes.component';

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
	const [tab, setTab] = useState(0);

	const { data: circuitNodes, isLoading: isCircuitNodesLoading } = useGetCircuitNodes(id ? Number(id) : 0);
	const { data: circuit, isLoading: isCircuitLoading } = useGetCircuit(id ? Number(id) : 0);

	const handleOnTabChange = (_event: React.SyntheticEvent, newValue: number) => {
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
				<Breadcrumbs />
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
							<CircuitNodes nodeCanisterId={circuitNodes.principal} />
						</CustomTabPanel>
						<CustomTabPanel value={tab} index={1}>
							Item Two
						</CustomTabPanel>
						<CustomTabPanel value={tab} index={2}>
							Item Three
						</CustomTabPanel>
					</Stack>
					<CircuitSideBar circuit={circuit} nodeCanisterId={circuitNodes.principal} />
				</Stack>
			</Stack>
		</Paper>
	);
};
