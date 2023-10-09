import { Grid, Stack, Box } from '@mui/material';
import { CircuitCard } from 'components/CircuitCard';
import { IconButton } from 'components/IconButton';
import { Link } from 'components/Link';
import { Menu } from 'components/Menu';
import { Caption, SubTitle } from 'components/Typography';
import { Circuit as ICircuit } from 'lib/types';

export const Circuit = ({ circuit, onEdit }: { circuit: ICircuit; onEdit: () => void }) => {
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
					<Link href={`/circuits/1`}>
						<SubTitle>{circuit.name}</SubTitle>
					</Link>
					<Stack direction="column" alignItems="center">
						<Caption color="text.secondary">0.9T</Caption>
						<Caption color="text.secondary">Active</Caption>
						<Caption color="text.secondary">20MB</Caption>
					</Stack>
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
