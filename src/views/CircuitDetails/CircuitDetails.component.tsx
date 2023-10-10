import { Grid, Paper, Stack } from '@mui/material';
import { StandaloneSwitch } from 'components/Form/Switch';
import { IconButton } from 'components/IconButton';
import { Menu } from 'components/Menu';
import { Back } from 'components/Navigation';
import { Spacer } from 'components/Spacer';
import { Caption, SubTitle, Title } from 'components/Typography';
import { useGetCircuit, useGetCircuitNodes } from 'lib/hooks';
import { toReadableDate } from 'lib/utils/date.utils';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CircuitData } from '../CircuitStatus';

export const Circuit = () => {
	const { id } = useParams();
	const [isActive, setIsActive] = useState(false);

	const { data: circuitNodes, isLoading: isCircuitNodesLoading } = useGetCircuitNodes(id ? Number(id) : 0);
	const { data: circuit, isLoading: isCircuitLoading } = useGetCircuit(id ? Number(id) : 0);

	const isLoaded = !!circuit && !isCircuitLoading && !!circuitNodes && !isCircuitNodesLoading;
	if (!isLoaded) {
		return <>Loading...</>;
	}

	return (
		<Stack direction="column" alignItems="center" spacing={2} width="100%">
			<Stack direction="column" spacing={2} alignItems="flex-start" width="100%" px={8}>
				<Back />
				<Stack direction="row" gap={1} flexWrap="wrap" alignItems="center" justifyContent="space-between" width="100%">
					<Title>{circuit.name}</Title>
					<Stack direction="row" spacing={1} alignItems="center">
						<StandaloneSwitch
							label={isActive ? 'Active' : 'Inactive'}
							labelPlacement="start"
							name="active"
							value={isActive}
							onChange={setIsActive}
						/>
						<IconButton icon="settings" />
						<Menu label={<IconButton icon="more" />} id="circuit-menu" menu={[]} />
					</Stack>
				</Stack>
				<Stack direction="column" spacing={0}>
					<Stack direction="row" flexWrap="wrap" alignItems="center" spacing={0} gap={1}>
						<Caption>Last saved {toReadableDate(circuit.updatedAt, { includeTime: true })}</Caption>
						<Spacer />
						<Caption>Last run {circuit.runAt ? toReadableDate(circuit.runAt, { includeTime: true }) : '-'}</Caption>
					</Stack>
					<CircuitData nodesPrincipal={circuitNodes.principal} />
				</Stack>
			</Stack>
			<Paper
				sx={{
					width: '100%',
					height: 'calc(100vh - 260px)'
				}}
			>
				<Grid container height="100%">
					<Grid item xs={4}>
						<Stack
							direction="column"
							spacing={2}
							alignItems="center"
							sx={{ backgroundColor: 'background.paper', height: '100%', p: 2 }}
						>
							<Stack direction="row" spacing={1} alignItems="center">
								<SubTitle>Import</SubTitle>
								<IconButton icon="add" />
							</Stack>
							{/* <Stack
								justifyContent="center"
								direction="row"
								sx={{
									p: 2,
									width: 270,
									background: theme => theme.palette.primary.main,
									color: theme => theme.palette.primary.contrastText
								}}
							>
								
							</Stack> */}
						</Stack>
					</Grid>
					<Grid item xs={8}>
						<Stack sx={{ height: '100%', p: 2 }}>
							<Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
								<SubTitle>Export</SubTitle>
								<IconButton icon="add" />
							</Stack>
						</Stack>
					</Grid>
				</Grid>
			</Paper>
		</Stack>
	);
};
