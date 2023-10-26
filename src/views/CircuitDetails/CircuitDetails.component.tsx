import { Box, Stack, Tab, Tabs } from '@mui/material';
import { useGetCircuit, useGetCircuitNodes, useGetNodeCanisterId, useGetParam } from 'lib/hooks';
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

export const CircuitDetails = () => {
	const [tab, setTab] = useState(0);

	const circuitId = useGetParam('circuitId');
	const nodeCanisterId = useGetNodeCanisterId(Number(circuitId));
	const { data: nodes, isLoading: isNodesLoading } = useGetCircuitNodes(Number(circuitId));
	const { data: circuit, isLoading: isCircuitLoading } = useGetCircuit(Number(circuitId));

	const isLoaded = !!circuit && !isCircuitLoading && !!nodes && !isNodesLoading;
	if (!isLoaded) {
		return <>Loading...</>;
	}

	return (
		<Stack
			direction="row"
			height="calc(100vh - 64px)"
			sx={{ borderTop: theme => `1px solid ${theme.palette.divider}` }}
		>
			<Stack
				direction="column"
				gap={1}
				sx={{ flex: '1 1 70%', padding: 4, borderRight: theme => `1px solid ${theme.palette.divider}` }}
			>
				<Breadcrumbs />
				<Tabs value={tab} onChange={(_e, tab) => setTab(tab)} aria-label="basic tabs example">
					<Tab label="Nodes" {...a11yProps(0)} />
					<Tab label="Settings" {...a11yProps(1)} />
					<Tab label="History" {...a11yProps(2)} />
				</Tabs>
				<Box mt={2}>
					<CustomTabPanel value={tab} index={0}>
						<CircuitNodes nodes={nodes} />
					</CustomTabPanel>
					<CustomTabPanel value={tab} index={1}>
						Item Two
					</CustomTabPanel>
					<CustomTabPanel value={tab} index={2}>
						Item Three
					</CustomTabPanel>
				</Box>
			</Stack>
			<CircuitSideBar circuit={circuit} nodeCanisterId={nodeCanisterId} />
		</Stack>
	);
};
