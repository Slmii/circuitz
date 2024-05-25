import { Divider, FormLabel, Paper, Stack } from '@mui/material';
import { Drawer } from 'components/Drawer';
import { Form } from 'components/Form';
import { Field } from 'components/Form/Field';
import { B2, H5 } from 'components/Typography';
import { useAddConnector, useFormSubmit, useGetCircuitNodes, useModal, useSnackbar } from 'lib/hooks';
import { canisterConnectorSchema } from 'lib/schemas';
import { ConnectorModalProps, Node } from 'lib/types';
import { HttpRequestHeaders } from './HttpHeadersConfig.component';
import { Select } from 'components/Form/Select';
import {
	APPLICATION_AUTHENTICATION_LOCATION_OPTIONS,
	APPLICATION_AUTHENTICATION_OPTIONS,
	HTTP_METHODS,
	NODE_URL,
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
import { Button } from 'components/Button';
import createMapper from 'map-factory';

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
					<TestConnection />
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
			<Stack direction="column" spacing={2}>
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
							<TokenLocation name="token" />
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
							<Stack spacing={0.5}>
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
							<TokenLocation name="jwt" />
						</>
					)}
				</Stack>
			</Stack>
		</Paper>
	);
};

const TokenLocation = ({ name }: { name: string }) => {
	const { watch } = useFormContext();

	return (
		<>
			<Select
				name={`authentication.${name}.location.selected`}
				label="Token Location"
				options={APPLICATION_AUTHENTICATION_LOCATION_OPTIONS}
			/>
			{watch(`authentication.${name}.location.selected`) === 'HTTPHeader' && (
				<>
					<Field
						name={`authentication.${name}.location.header.name`}
						label="Header Name"
						placeholder="Enter a header name"
					/>
					<Field
						name={`authentication.${name}.location.header.scheme`}
						label="Header Scheme"
						placeholder="Enter a header scheme"
					/>
				</>
			)}
			{watch(`authentication.${name}.location.selected`) === 'Query' && (
				<Field
					name={`authentication.${name}.location.queryParam`}
					label="Parameter name"
					placeholder="Enter a parameter name"
				/>
			)}
		</>
	);
};

const TestConnection = () => {
	const { watch, getValues } = useFormContext<HttpConnectorFormValues>();
	const { errorSnackbar, successSnackbar } = useSnackbar();
	const [isTestLoading, setIsTestLoading] = useState(false);

	const handleOnTestConnection = async () => {
		const { baseUrl, testConnection, headers, authentication } = getValues();
		const { relativeUrl, method, error } = testConnection;

		if (!baseUrl || !relativeUrl) {
			return;
		}

		setIsTestLoading(true);
		try {
			let url = `${baseUrl}${relativeUrl}`;

			const requestHeaders = headers.reduce<Record<string, string>>((acc, { key, value }) => {
				acc[key] = value;
				return acc;
			}, {});

			if (authentication.selected === 'JWT') {
				const { location, payload, secret, signatureMethod } = authentication.jwt;

				const response = await fetch(`${NODE_URL}/jwt`, {
					method: 'POST',
					body: JSON.stringify({
						payload,
						secret,
						signatureMethod
					}),
					headers: {
						'Content-Type': 'application/json'
					}
				});

				const jwtToken = (await response.json()) as string;

				if (location.selected === 'HTTPHeader') {
					requestHeaders[location.header.name] = `${location.header.scheme} ${jwtToken}`;
				} else if (location.selected === 'Query') {
					url += `?${location.queryParam}=${jwtToken}`;
				}
			} else if (authentication.selected === 'Token') {
				const { location, token } = authentication.token;

				if (location.selected === 'HTTPHeader') {
					requestHeaders[location.header.name] = `${location.header.scheme} ${token}`;
				} else if (location.selected === 'Query') {
					url += `?${location.queryParam}=${token}`;
				}
			} else if (authentication.selected === 'Basic') {
				const { username, password } = authentication.basic;
				requestHeaders['Authorization'] = `Basic ${btoa(`${username}:${password}`)}`;
			}

			const response = await fetch(url, {
				method,
				headers: requestHeaders
			});

			if (!response.ok) {
				setIsTestLoading(false);
				errorSnackbar('Test Connection Failed');
				return;
			}

			const data = await response.json();
			if (error.field.length && error.value.length) {
				const mapper = createMapper();
				mapper.map(error.field).to('error');

				const output = mapper.execute(data);
				if (output.error === error.value) {
					setIsTestLoading(false);
					errorSnackbar('Test Connection Failed');
					return;
				}
			}

			setIsTestLoading(false);
			successSnackbar('Test Connection Successful');
		} catch (error) {
			errorSnackbar('Test Connection Failed');
			setIsTestLoading(false);

			console.error('Test Connection Failed', error);
		}
	};

	return (
		<Paper sx={{ p: 2 }}>
			<Stack direction="column" spacing={2}>
				<FormLabel>Test Connection</FormLabel>
				<Stack direction="column" spacing={2}>
					<Field
						name="testConnection.relativeUrl"
						label="Relative URL"
						placeholder="/path/to/endpoint"
						helperText={`Relative to ${watch('baseUrl')}`}
					/>
					<Select
						label="Method"
						name="testConnection.method"
						options={HTTP_METHODS.map(method => ({ id: method, label: method }))}
					/>
					<Field
						name="testConnection.error.field"
						label="Error Field"
						placeholder="Path to error field"
						helperText="This field only needs to be set if the API always returns a successful HTTP status code, but then uses a field in the HTTP response body to indicate a failed request. For example, if the API always returns a 200 success HTTP status code, but then indicates errors via an 'error.message' field in the HTTP response body."
					/>
					<Field
						name="testConnection.error.value"
						label="Error Value"
						helperText="Use this field to the exact value in the HTTP response body field that should be used to determine if the request failed."
					/>
					{watch('testConnection.relativeUrl') && (
						<Button
							loading={isTestLoading}
							variant="contained"
							sx={{ width: 'fit-content' }}
							onClick={handleOnTestConnection}
						>
							Test
						</Button>
					)}
				</Stack>
			</Stack>
		</Paper>
	);
};

const OutputNodeFormValuesUpdater = () => {
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
