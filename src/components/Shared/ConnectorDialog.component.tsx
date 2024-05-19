import { Stack } from '@mui/material';
import { Drawer } from 'components/Drawer';
import { Form } from 'components/Form';
import { Field } from 'components/Form/Field';
import { H5 } from 'components/Typography';
import { useAddConnector, useFormSubmit, useModal } from 'lib/hooks';
import { canisterConnectorSchema } from 'lib/schemas';
import { ConnectorModalProps } from 'lib/types';

export interface CanisterConnectorFormValues {
	name: string;
	canisterId: string;
}

export const CanisterConnectorDialog = () => {
	const { formRef, submitter } = useFormSubmit();
	const { closeModal, state } = useModal<ConnectorModalProps>('CONNECTOR');

	const { mutateAsync: addConnector, isPending: isAddConnectorPending } = useAddConnector();

	return (
		<Drawer
			title="New Connector"
			isOpen={state.isOpen}
			onClose={closeModal}
			onSubmit={submitter}
			isLoading={isAddConnectorPending}
			disableHandlebarsHelpers
		>
			<Stack direction="column" spacing={2}>
				<H5 fontWeight="bold">General</H5>
				<Form<CanisterConnectorFormValues>
					action={async data => {
						await addConnector({
							name: data.name,
							connector_type: {
								Canister: data.canisterId
							}
						});

						closeModal();
					}}
					schema={canisterConnectorSchema}
					defaultValues={{
						name: '',
						canisterId: ''
					}}
					myRef={formRef}
				>
					<Field maxLength={30} name="name" label="Name" placeholder="Enter a name" />
					<Field name="canisterId" label="Canister ID" placeholder="aaaaa-aa" />
				</Form>
			</Stack>
		</Drawer>
	);
};
