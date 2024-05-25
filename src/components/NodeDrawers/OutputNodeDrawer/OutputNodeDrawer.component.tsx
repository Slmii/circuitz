import { Divider, Stack } from '@mui/material';
import { OutputNodeDrawerProps, OutputNodeFormValues } from '../NodeDrawers.types';
import { Drawer } from 'components/Drawer';
import { ConnectorModalProps } from 'lib/types';
import { Alert } from 'components/Alert';
import { H5 } from 'components/Typography';
import { Field } from 'components/Form/Field';
import { Form } from 'components/Form';
import { useFormSubmit, useGetConnectors, useModal } from 'lib/hooks';
import { Select } from 'components/Form/Select';
import { IconButton } from 'components/IconButton';
import { APPLICATION_OPTIONS, CONNECTOR_HELP_TEXT } from 'lib/constants';
import { SelectAutocomplete } from 'components/Form/SelectAutocomplete';

export const OutputNodeDrawer = ({ node, open, onClose }: OutputNodeDrawerProps) => {
	const { formRef, submitter } = useFormSubmit();
	const { openModal } = useModal<ConnectorModalProps>('CONNECTOR');

	const { data: connectors, isLoading: isConnectorsLoading } = useGetConnectors();

	return (
		<Drawer
			onClose={onClose}
			onSubmit={submitter}
			isOpen={open}
			isLoading={false}
			// isLoading={isAddNodePending || isEditNodePending}
			title="Output Node"
		>
			{open && (
				<Form<OutputNodeFormValues>
					action={() => {}}
					defaultValues={{
						name: '',
						description: '',
						application: 'Canister',
						connector: ''
					}}
					myRef={formRef}
					// schema={inputCanisterSchema}
					render={({ watch }) => (
						<>
							<Stack direction="column" spacing={2}>
								<Alert severity="info">An Ouput Node sends data to the outside world.</Alert>
								<Select disabled={!!node} name="application" label="Application" options={APPLICATION_OPTIONS} />
							</Stack>
							<Divider />
							<Stack direction="column" spacing={2}>
								<H5 fontWeight="bold">General</H5>
								<Stack direction="column" spacing={4}>
									<Field maxLength={30} name="name" label="Name" placeholder="Enter a name" />
									<Field
										name="description"
										label="Description"
										multiline
										multilineRows={5}
										placeholder="Enter a description"
										maxLength={500}
									/>
									<SelectAutocomplete
										name="connector"
										label="Connector"
										isOptionsLoading={!!connectors && isConnectorsLoading}
										options={(connectors ?? []).map(connector => ({
											id: connector.id.toString(),
											label: connector.name
										}))}
										outsideElement={
											<Stack direction="row">
												{watch('connector') && (
													<IconButton
														icon="edit-linear"
														tooltip="Edit Connector"
														onClick={() => {
															const connector = connectors?.find(
																connector => connector.id === Number(watch('connector'))
															);

															openModal({
																type: watch('application'),
																node,
																connector
															});
														}}
													/>
												)}
												<IconButton
													icon="add-linear"
													tooltip="New Connector"
													onClick={() => openModal({ type: watch('application'), node })}
												/>
											</Stack>
										}
										helperText={CONNECTOR_HELP_TEXT}
									/>
								</Stack>
							</Stack>
						</>
					)}
				/>
			)}
		</Drawer>
	);
};
