import { Divider, Stack } from '@mui/material';
import { OutputNodeDrawerProps, OutputNodeFormValues } from '../NodeDrawers.types';
import { Drawer } from 'components/Drawer';
import { Alert } from 'components/Alert';
import { H5 } from 'components/Typography';
import { Field } from 'components/Form/Field';
import { Form } from 'components/Form';
import { useFormSubmit } from 'lib/hooks';
import { Select } from 'components/Form/Select';
import { APPLICATION_OPTIONS } from 'lib/constants';
import { ConnectorField } from 'components/Shared';

export const OutputNodeDrawer = ({ node, open, onClose }: OutputNodeDrawerProps) => {
	const { formRef, submitter } = useFormSubmit();

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
									<ConnectorField node={node} newConnectorType={watch('application')} />
								</Stack>
							</Stack>
						</>
					)}
				/>
			)}
		</Drawer>
	);
};
