import { Stack, Typography, Grid } from '@mui/material';
import { Circuit } from './Circuit.component';
import { IconButton } from 'components/IconButton';
import { useState } from 'react';
import { Dialog } from 'components/Dialog';
import { Form } from 'components/Form';
import { Field } from 'components/Form/Field';
import { circuitSchema } from 'lib/schemas';
import { Circuit as ICircuit } from 'lib/types';
import { useDialogFormSubmit } from 'lib/hooks/useDialogFormSubmit';
import { Principal } from '@dfinity/principal';

const circuits: ICircuit[] = [
	{
		id: 1,
		name: 'Circuit 1',
		description: 'Circuit 1 description',
		createdAt: new Date(),
		updatedAt: new Date(),
		isFavorite: true,
		userId: Principal.anonymous()
	},
	{
		id: 2,
		name: 'Circuit 2',
		description: 'Circuit 2 description',
		createdAt: new Date(),
		updatedAt: new Date(),
		isFavorite: false,
		userId: Principal.anonymous()
	},
	{
		id: 3,
		name: 'Circuit 3',
		description: 'Circuit 3 description',
		createdAt: new Date(),
		updatedAt: new Date(),
		isFavorite: true,
		userId: Principal.anonymous()
	}
];

export const Circuits = () => {
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [circuit, setCircuit] = useState<ICircuit | null>(null);

	const { formRef, handleSubmit } = useDialogFormSubmit();

	return (
		<>
			<Stack direction="column" spacing={0} gap={2}>
				<Stack direction="row" alignItems="center" justifyContent="space-between">
					<Typography variant="h3">Circuits</Typography>
					<IconButton
						icon="add"
						size="large"
						tooltip="Create Circuit"
						onClick={() => {
							setCircuit(null);
							setIsFormOpen(true);
						}}
					/>
				</Stack>
				<Grid container spacing={2}>
					{circuits.map(circuit => (
						<Circuit
							key={circuit.id}
							circuit={circuit}
							onEdit={() => {
								setCircuit(circuit);
								setIsFormOpen(true);
							}}
						/>
					))}
				</Grid>
			</Stack>
			<Dialog
				open={isFormOpen}
				onClose={() => setIsFormOpen(false)}
				title={circuit ? 'Edit' : 'Create'}
				onCancelText="Cancel"
				onConfirmText={circuit ? 'Save' : 'Create'}
				onConfirm={handleSubmit}
			>
				<Form
					action={data => console.log(data)}
					defaultValues={{
						name: circuit?.name,
						description: circuit?.description
					}}
					schema={circuitSchema}
					myRef={formRef}
				>
					<Typography variant="body1" color="text.secondary">
						{circuit ? 'Edit the Circuit details below' : 'Enter the Circuit details below'}
					</Typography>
					<Field name="name" label="Name" placeholder="Enter a name for the circuit" />
					<Field
						name="description"
						label="Description"
						multiline
						multilineRows={5}
						placeholder="Enter a description for the circuit"
					/>
				</Form>
			</Dialog>
		</>
	);
};
