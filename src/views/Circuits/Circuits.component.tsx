import { Stack, Typography, Grid } from '@mui/material';
import { Circuit } from './Circuit.component';

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
					<Circuit key={circuit.id} name={circuit.name} />
				))}
			</Grid>
		</Stack>
	);
};
