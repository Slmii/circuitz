import { Stack, Grid } from '@mui/material';
import { CreateCircuit, Circuit } from './Circuit.component';
import { IconButton } from 'components/IconButton';
import { useState } from 'react';
import { Dialog } from 'components/Dialog';
import { Form } from 'components/Form';
import { Field } from 'components/Form/Field';
import { circuitSchema } from 'lib/schemas';
import { Circuit as ICircuit } from 'lib/types';
import { useDialogFormSubmit } from 'lib/hooks/useDialogFormSubmit';
import { Paragraph, Title } from 'components/Typography';
import { SkeletonCircuitCard } from 'components/Skeleton';
import { useAddCircuit, useGetCircuits } from 'lib/hooks';

interface CircuitFormValues {
	name: string;
	description: string;
}

export const Circuits = () => {
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [circuit, setCircuit] = useState<ICircuit | null>(null);

	const { formRef, handleSubmit } = useDialogFormSubmit();
	const { mutateAsync: add, isLoading: isAddLoading } = useAddCircuit();
	const { data: circuits, isLoading: isCircuitsLoading } = useGetCircuits();

	const handleOnSubmit = async (data: CircuitFormValues) => {
		await add({
			description: data.description.length ? [data.description] : [],
			name: data.name
		});
		setIsFormOpen(false);
	};

	const isLoaded = !!circuits && !isCircuitsLoading;

	return (
		<>
			<Stack direction="column" spacing={0} gap={2}>
				<Stack direction="row" alignItems="center" justifyContent="space-between">
					<Title>Circuits</Title>
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
				{!isLoaded ? (
					<Stack direction="row" alignItems="flex-start" flexWrap="wrap" gap={2}>
						{Array.from({ length: 3 }).map((_, i) => (
							<SkeletonCircuitCard key={i} />
						))}
					</Stack>
				) : (
					<Grid container spacing={2}>
						<>
							{!circuits.length ? (
								<CreateCircuit onClick={() => setIsFormOpen(true)} />
							) : (
								circuits.map(circuit => (
									<Circuit
										key={circuit.id}
										circuit={circuit}
										onEdit={() => {
											setCircuit(circuit);
											setIsFormOpen(true);
										}}
									/>
								))
							)}
						</>
					</Grid>
				)}
			</Stack>
			<Dialog
				open={isFormOpen}
				onClose={() => setIsFormOpen(false)}
				title={circuit ? 'Edit' : 'Create'}
				onCancelText="Cancel"
				onConfirmText={circuit ? 'Save' : 'Create'}
				onConfirm={handleSubmit}
				onConfirmLoading={isAddLoading}
				onCancelDisabled={isAddLoading}
				width="md"
			>
				<Form<CircuitFormValues>
					action={handleOnSubmit}
					defaultValues={{
						name: circuit?.name ?? '',
						description: circuit?.description ?? ''
					}}
					schema={circuitSchema}
					myRef={formRef}
				>
					<Paragraph color="text.secondary">
						{circuit ? 'Edit the Circuit details below' : 'Enter the Circuit details below'}
					</Paragraph>
					<Field disabled={isAddLoading} name="name" label="Name" placeholder="Enter a name for the circuit" />
					<Field
						disabled={isAddLoading}
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
