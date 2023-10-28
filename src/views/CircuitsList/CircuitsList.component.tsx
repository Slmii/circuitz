import { Stack, Grid } from '@mui/material';
import { CircuitCard, CircuitCardPaper } from './CircuitCard.component';
import { IconButton } from 'components/IconButton';
import { useState } from 'react';
import { Dialog } from 'components/Dialog';
import { Form } from 'components/Form';
import { Field } from 'components/Form/Field';
import { circuitSchema } from 'lib/schemas';
import { Circuit as ICircuit } from 'lib/types';
import { useFormSubmit } from 'lib/hooks/useFormSubmit';
import { B1, H1 } from 'components/Typography';
import { SkeletonCircuitCard } from 'components/Skeleton';
import { useAddCircuit, useEditCircuit, useGetCircuits } from 'lib/hooks';
import { Button } from 'components/Button';

interface CircuitFormValues {
	name: string;
	description: string;
}

export const Circuits = () => {
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [circuit, setCircuit] = useState<ICircuit | null>(null);

	const { formRef, submitter } = useFormSubmit();
	const { mutateAsync: add, isLoading: isAddLoading } = useAddCircuit();
	const { mutateAsync: edit, isLoading: isEditLoading } = useEditCircuit();
	const { data: circuits, isLoading: isCircuitsLoading } = useGetCircuits();

	const handleOnSubmit = async (data: CircuitFormValues) => {
		if (!circuit) {
			await add({
				description: data.description.length ? [data.description] : [],
				name: data.name
			});
		} else {
			await edit({
				circuitId: circuit.id,
				data: {
					description: data.description.length ? [data.description] : [],
					name: data.name
				}
			});
		}

		setIsFormOpen(false);
	};

	const isLoaded = !!circuits && !isCircuitsLoading;
	const isLoading = isAddLoading || isEditLoading;

	return (
		<>
			<Stack direction="column" spacing={0} gap={2}>
				<Stack direction="row" alignItems="center" justifyContent="space-between">
					<H1>Circuits</H1>
					<IconButton
						icon="add-square"
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
								<Grid item xs={12} sm={6} md={4}>
									<CircuitCardPaper>
										<Button
											size="large"
											startIcon="add-linear"
											variant="contained"
											onClick={() => {
												setCircuit(null);
												setIsFormOpen(true);
											}}
										>
											Add Circuit
										</Button>
									</CircuitCardPaper>
								</Grid>
							) : (
								circuits.map(circuit => (
									<CircuitCard
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
				onConfirm={submitter}
				onConfirmLoading={isLoading}
				onCancelDisabled={isLoading}
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
					<B1 color="text.secondary">{circuit ? 'Edit Circuit details below' : 'Enter Circuit details below'}</B1>
					<Field disabled={isLoading} name="name" label="Name" placeholder="Enter a name for the circuit" />
					<Field
						disabled={isLoading}
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
