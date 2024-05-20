import { Divider, FormLabel, Paper, Stack } from '@mui/material';
import { Drawer } from 'components/Drawer';
import { Form } from 'components/Form';
import { Field } from 'components/Form/Field';
import { B2, H5 } from 'components/Typography';
import { useAddConnector, useFormSubmit, useGetCircuitNodes, useModal } from 'lib/hooks';
import { canisterConnectorSchema } from 'lib/schemas';
import { ConnectorModalProps, Node } from 'lib/types';
import { HttpRequestHeaders } from './HttpHeadersConfig.component';
import { Select } from 'components/Form/Select';
import {
	APPLICATION_AUTHENTICATION_LOCATION_OPTIONS,
	APPLICATION_AUTHENTICATION_OPTIONS,
	JWT_SIGNATURE_OPTIONS
} from 'lib/constants';
import { CanisterConnectorFormValues, HttpConnectorFormValues } from 'components/NodeDrawers';
import { useFormContext } from 'react-hook-form';
import { Editor } from 'components/Editor';
import { useEffect, useState } from 'react';
import { stringifyJson, getHttpConnectorFormValues } from 'lib/utils';
import { getSampleData } from 'api/nodes.api';
import { HandlebarsInfo } from './HandlebarsInfo.component';
import { useParams } from 'react-router-dom';
import { StandaloneCheckbox } from 'components/Form/Checkbox';
import { WithLiveEditor } from './WithLiveEditor.component';

export const CanisterConnectorDialog = () => {
	const { formRef, submitter } = useFormSubmit();
	const { closeModal, state } = useModal<ConnectorModalProps>('CONNECTOR');

	const { mutateAsync: addConnector, isPending: isAddConnectorPending } = useAddConnector();

	return (
		<Drawer
			title="New Connector"
			isOpen={state.isOpen && state.props.type === 'Canister'}
			onClose={closeModal}
			onSubmit={submitter}
			isLoading={isAddConnectorPending}
			disableHandlebarsHelpers
		>
			<Stack direction="column" spacing={2}>
				<H5 fontWeight="bold">Application Details</H5>
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

export const HttpConnectorDialog = () => {
	const { formRef, submitter } = useFormSubmit();
	const { closeModal, state } = useModal<ConnectorModalProps | undefined>('CONNECTOR');

	const { mutateAsync: addConnector, isPending: isAddConnectorPending } = useAddConnector();

	return (
		<Drawer
			title="New Connector"
			isOpen={state.isOpen && state.props?.type === 'Http'}
			onClose={closeModal}
			onSubmit={submitter}
			isLoading={isAddConnectorPending}
		>
			<Stack direction="column" spacing={2}>
				<H5 fontWeight="bold">Application Details</H5>
				<Form<HttpConnectorFormValues>
					action={data => {
						addConnector;
						console.log(data);
						// await addConnector({
						// 	name: data.name,
						// 	connector_type: {
						// 		Canister: data.canisterId
						// 	}
						// });

						// closeModal();
					}}
					schema={canisterConnectorSchema}
					defaultValues={getHttpConnectorFormValues()}
					myRef={formRef}
				>
					<OutputNodeFormValuesUpdater />
					<Field maxLength={30} name="name" label="Name" placeholder="Enter a name" />
					<Field
						name="baseUrl"
						label="Base URL"
						placeholder="https://api.example.com"
						helperText="This part of an API’s URL is used across all of the HTTP endpoints you invoke. A Base URL makes it easier to configure Nodes."
					/>
					<HttpRequestHeaders />
					<Authentication />
				</Form>
			</Stack>
		</Drawer>
	);
};

const Authentication = () => {
	const [isLivePreview, setIsLivePreview] = useState(false);
	const { watch } = useFormContext<HttpConnectorFormValues>();

	return (
		<Paper sx={{ p: 2 }}>
			<Stack direction="column" spacing={1}>
				<FormLabel>Authentication</FormLabel>
				<Stack direction="column" spacing={2}>
					<Select name="authentication.selected" label="Method" options={APPLICATION_AUTHENTICATION_OPTIONS} />
					{watch('authentication.selected') === 'Basic' && (
						<>
							<Divider />
							<Field name="authentication.basic.username" label="Username" placeholder="Enter a usename" />
							<Field
								name="authentication.basic.password"
								label="Password"
								type="password"
								placeholder="Enter a password"
							/>
						</>
					)}
					{watch('authentication.selected') === 'Token' && (
						<>
							<Divider />
							<Field name="authentication.token.token" type="password" label="Token" placeholder="Enter a token" />
							<TokenLocation />
						</>
					)}
					{watch('authentication.selected') === 'JWT' && (
						<>
							<Divider />
							<Select
								name="authentication.jwt.signatureMethod"
								label="Signature Method"
								options={JWT_SIGNATURE_OPTIONS}
							/>
							<Stack
								spacing={0.5}
								sx={{
									p: 2,
									borderRadius: 1,
									backgroundColor: 'background.paper'
								}}
							>
								<B2>
									<HandlebarsInfo />
								</B2>
								<StandaloneCheckbox
									label="Live Preview"
									name="livePreview"
									checked={isLivePreview}
									onChange={setIsLivePreview}
								/>
								<Stack direction="column" spacing={1}>
									<WithLiveEditor
										input={watch('authentication.jwt.payload')}
										context={watch('authentication.jwt.inputSampleData')}
										isLivePreview={isLivePreview}
										editorProps={{
											name: 'authentication.jwt.payload',
											height: 200,
											mode: 'json'
										}}
										liveEditorProps={{
											name: 'jwtPayloadLivePreview',
											height: 200,
											mode: 'json'
										}}
									/>
									<Editor mode="json" name="authentication.jwt.inputSampleData" height={200} />
								</Stack>
							</Stack>
							<Field name="authentication.jwt.secret" type="password" label="Secret" placeholder="Enter a secret" />
							<TokenLocation />
						</>
					)}
				</Stack>
			</Stack>
		</Paper>
	);
};

const TokenLocation = () => {
	const { watch } = useFormContext();

	return (
		<>
			<Select
				name="authentication.token.location.selected"
				label="Token Location"
				options={APPLICATION_AUTHENTICATION_LOCATION_OPTIONS}
			/>
			{watch('authentication.token.location.selected') === 'HTTPHeader' && (
				<>
					<Field
						name="authentication.token.location.header.name"
						label="Header Name"
						placeholder="Enter a header name"
					/>
					<Field
						name="authentication.token.location.header.scheme"
						label="Header Scheme"
						placeholder="Enter a header scheme"
					/>
				</>
			)}
			{watch('authentication.token.location.selected') === 'Query' && (
				<Field
					name="authentication.token.location.queryParam"
					label="Parameter name"
					placeholder="Enter a parameter name"
				/>
			)}
		</>
	);
};

export const OutputNodeFormValuesUpdater = () => {
	const { circuitId } = useParams<{ circuitId: string }>();
	const { setValue } = useFormContext<HttpConnectorFormValues>();

	const { state } = useModal<ConnectorModalProps | undefined>('CONNECTOR');
	const { data: circuitNodes } = useGetCircuitNodes(Number(circuitId), {
		enabled: !!circuitId
	});

	useEffect(() => {
		const init = async () => {
			if (!circuitNodes) {
				return;
			}

			// In case of a new node
			// 1. set index to the length of current nodes + 1
			// 2. populate the sample data

			// In case of an existing node
			// 1. set index to the index of the node in the array
			// 2. get all the nodes before and including the current node

			const index = state.props?.node
				? circuitNodes.findIndex(({ id }) => id === Number(state.props?.node?.id))
				: circuitNodes.length + 1;

			const previousNodes: Node[] = state.props?.node ? circuitNodes.slice(0, index + 1) : circuitNodes;

			const collectedSampleData = await getSampleData(previousNodes, {
				skipNodes: ['LookupCanister', 'LookupHttpRequest'],
				includePostMapper: false
			});

			setValue('authentication.jwt.inputSampleData', stringifyJson(collectedSampleData));
		};

		init();
	}, [circuitNodes, setValue, state.props?.node]);

	return null;
};
