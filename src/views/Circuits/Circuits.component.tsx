import { Stack, Typography, Grid, Paper, ButtonBase } from '@mui/material';
import { Icon } from 'components/Icon';

const circuits = [
	{
		id: '1',
		name: 'Circuit 1',
		description: 'Circuit 1 description'
	},
	{
		id: '2',
		name: 'Circuit 2',
		description: 'Circuit 2 description'
	},
	{
		id: '3',
		name: 'Circuit 3',
		description: 'Circuit 3 description'
	}
];

export const Circuits = () => {
	return (
		<Stack direction="column" spacing={0} gap={2}>
			<Typography variant="h3">Circuits</Typography>
			<Grid container spacing={2}>
				{circuits.map(circuit => (
					<Grid key={circuit.id} item xs={12} md={4}>
						<Paper
							component={ButtonBase}
							sx={{
								p: 2,
								height: 300,
								width: '100%',
								backgroundColor: 'transparent',
								border: theme => `3px solid ${theme.palette.primary.main}`
							}}
						>
							<Stack direction="column" spacing={1}>
								<Stack alignItems="center" direction="column" spacing={1}>
									<Icon icon="add" fontSize="large" />
									<Typography variant="body1">{circuit.name}</Typography>
								</Stack>
								<Stack direction="column">
									<Typography variant="caption" color="text.secondary">
										0.9T
									</Typography>
									<Typography variant="caption" color="text.secondary">
										Active
									</Typography>
									<Typography variant="caption" color="text.secondary">
										20MB
									</Typography>
								</Stack>
							</Stack>
						</Paper>
					</Grid>
				))}
			</Grid>
		</Stack>
	);
};
