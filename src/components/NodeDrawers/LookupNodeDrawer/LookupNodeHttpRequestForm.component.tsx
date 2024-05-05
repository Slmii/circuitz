import { Divider, FormLabel, Paper, Stack } from '@mui/material';
import { RefObject, useState } from 'react';
import { Form } from 'components/Form';
import { Field } from 'components/Form/Field';
import { H5 } from 'components/Typography';
import { Node } from 'lib/types';
import { HttpMethod, NodeType } from 'declarations/nodes.declarations';
import { LookupCanisterFormValues, LookupHttpRequestFormValues } from '../NodeDrawers.types';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { IconButton } from 'components/IconButton';
import { Principal } from '@dfinity/principal';
import { getLookupCanisterValuesAsArg, getLookupHTTRequestFormValues, getNodeMetaData, stringifyJson } from 'lib/utils';
import { Button } from 'components/Button';
import { Select } from 'components/Form/Select';
import { HTTP_METHODS, OVERFLOW, OVERFLOW_FIELDS, POPULATE_SAMPLE_DATA } from 'lib/constants';
import { Alert, TipAlert } from 'components/Alert';
import { Editor } from 'components/Editor';
import { useGetCircuitNodes, useGetParam } from 'lib/hooks';
import { lookupHttpRequestSchema } from 'lib/schemas';
import { Icon } from 'components/Icon';
import { api } from 'api/index';

export const LookupNodeHttpRequestForm = ({
	formRef,
	node,
	onProcessNode
}: {
	formRef: RefObject<HTMLFormElement>;
	node?: Node;
	onProcessNode: (data: NodeType) => void;
}) => {
	const circuitId = useGetParam('circuitId');
	const { data: circuitNodes } = useGetCircuitNodes(Number(circuitId));

	const handleOnSubmit = (data: LookupCanisterFormValues) => {
		onProcessNode({
			LookupCanister: {
				name: data.name,
				description: data.description.length ? [data.description] : [],
				canister: Principal.fromText(data.canisterId),
				method: data.methodName,
				cycles: BigInt(data.cycles),
				args: getLookupCanisterValuesAsArg(data.args),
				sample_data: data.inputSampleData
			}
		});
	};

	return (
		<Form<LookupCanisterFormValues>
			action={handleOnSubmit}
			defaultValues={() => {
				const formValues = getLookupHTTRequestFormValues(node);
				let inputSampleData = formValues.inputSampleData;

				// If there is no inputSampleData, populate it with the last node's output
				if (!inputSampleData.length) {
					const lastNode = circuitNodes?.[circuitNodes.length - 1];
					if (lastNode) {
						const metadata = getNodeMetaData(lastNode);
						inputSampleData = metadata.inputSampleData;
					}
				}

				return {
					...formValues,
					inputSampleData
				};
			}}
			myRef={formRef}
			schema={lookupHttpRequestSchema}
		>
			<Stack direction="row" spacing={4} sx={OVERFLOW_FIELDS}>
				<Stack spacing={4} width="50%" sx={{ ...OVERFLOW, pr: 1 }}>
					<Stack direction="column" spacing={2}>
						<Alert severity="info">
							A Lookup HTTP Request Node queries data from an external Web2 API and forwards it to the subsequent Node
							in the Circuit
						</Alert>
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
						</Stack>
					</Stack>
					<Divider />
					<Stack direction="column" spacing={2}>
						<H5 fontWeight="bold">HTTP Request</H5>
						<Stack direction="column" spacing={4}>
							<Field
								name="url"
								label="URL Endpoint"
								endElement={<IconHelper />}
								placeholder="https://api.example.com/v1/data"
							/>
							<Select
								name="method"
								label="Method"
								options={HTTP_METHODS.map(method => ({ id: method, label: method }))}
							/>
							<Stack direction="column" spacing={0.25}>
								<Stack direction="row" spacing={1} alignItems="center">
									<FormLabel>Request Body</FormLabel>
									<IconHelper />
								</Stack>
								<Editor name="requestBody" mode="javascript" height={150} />
							</Stack>
							<HttpRequestHeaders />
							<Field
								name="cycles"
								type="number"
								label="Cycles (T)"
								placeholder="10_000_000_000"
								helperText="To determine the required cycles, use the Preview request feature. The cycles count varies based on the size of the request."
							/>
						</Stack>
					</Stack>
				</Stack>
				<Divider orientation="vertical" flexItem />
				<Stack direction="column" spacing={2} width="50%">
					<Preview nodesLength={circuitNodes?.length ?? 0} />
					<TipAlert>{POPULATE_SAMPLE_DATA}</TipAlert>
					<Editor name="inputSampleData" mode="javascript" height="50%" />
				</Stack>
			</Stack>
		</Form>
	);
};

const HttpRequestHeaders = () => {
	const { fields, append, remove } = useFieldArray<LookupHttpRequestFormValues>({
		name: 'headers'
	});

	return (
		<Paper sx={{ p: 2 }}>
			<Stack direction="column" spacing={1}>
				<FormLabel>HTTP Headers</FormLabel>
				<Stack direction="column" spacing={2}>
					{fields.map((config, index) => (
						<Stack direction="row" spacing={1} key={config.id} alignItems="center">
							<Field fullWidth name={`headers.${index}.key`} label="Header" placeholder="Content-Type" />
							<Field fullWidth name={`headers.${index}.value`} label="Value" placeholder="application/json" />
							<IconButton
								icon="close-linear"
								tooltip="Remove HTTP Header"
								color="error"
								onClick={() => remove(index)}
							/>
						</Stack>
					))}
					<Button
						startIcon="add-linear"
						sx={{ width: 'fit-content' }}
						variant="outlined"
						size="large"
						onClick={() => append({ key: '', value: '' }, { shouldFocus: false })}
					>
						{!fields.length ? 'Add first HTTP Header' : 'Add HTTP Header'}
					</Button>
				</Stack>
			</Stack>
		</Paper>
	);
};

const Preview = ({ nodesLength }: { nodesLength: number }) => {
	const [isPreviewPending, setIsPreviewPending] = useState(false);
	const { getValues, setValue, trigger } = useFormContext<LookupHttpRequestFormValues>();

	return (
		<>
			<H5 fontWeight="bold">Preview data</H5>
			<Button
				variant="contained"
				loading={isPreviewPending}
				size="large"
				startIcon="infinite"
				onClick={async () => {
					const isValid = await trigger(['url', 'method']);
					if (!isValid) {
						return;
					}

					const values = getValues();
					const key = `Node:${nodesLength}`;

					setIsPreviewPending(true);
					try {
						let method: HttpMethod = { get: null };
						if (values.method === 'POST') {
							method = { post: null };
						}

						const data = await api.Nodes.previewLookupHTTPRequest({
							cycles: BigInt(values.cycles),
							headers: values.headers.map(header => [header.key, header.value]),
							method,
							request_body: values.requestBody.length ? [values.requestBody] : [],
							url: values.url
						});

						setValue('inputSampleData', stringifyJson({ ...JSON.parse(values.inputSampleData), [key]: data }));
					} catch (error) {
						setValue(
							'inputSampleData',
							stringifyJson({ ...JSON.parse(values.inputSampleData), [key]: (error as Error).message })
						);
					} finally {
						setIsPreviewPending(false);
					}
				}}
			>
				Send preview request
			</Button>
		</>
	);
};

const IconHelper = () => {
	return (
		<Icon
			fontSize="small"
			icon="info"
			tooltip={
				<>
					You can also also provide a path to a field in the preview data, eg: <code>{'{{data.name}}'}</code>
				</>
			}
		/>
	);
};
