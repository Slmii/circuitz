import { Divider, FormLabel, Paper, Stack } from '@mui/material';
import { RefObject, useEffect } from 'react';
import { Form } from 'components/Form';
import { Field } from 'components/Form/Field';
import { H5 } from 'components/Typography';
import { Node } from 'lib/types';
import { HttpMethod, NodeType } from 'declarations/nodes.declarations';
import { LookupHttpRequestFormValues } from '../NodeDrawers.types';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { IconButton } from 'components/IconButton';
import { extractDynamicKey, getLookupHTTRequestFormValues, getNodeMetaData, stringifyJson } from 'lib/utils';
import { Button } from 'components/Button';
import { Select } from 'components/Form/Select';
import { HTTP_METHODS, OVERFLOW, OVERFLOW_FIELDS, POPULATE_SAMPLE_DATA } from 'lib/constants';
import { Alert, TipAlert } from 'components/Alert';
import { Editor } from 'components/Editor';
import { useGetCircuitNodes, useGetParam, useLookupHttpRequestPreview } from 'lib/hooks';
import { lookupHttpRequestSchema } from 'lib/schemas';
import { Icon } from 'components/Icon';
import Handlebars from 'handlebars';
import { HandlebarsInfo } from 'components/Shared';

const getUrlValue = (values: LookupHttpRequestFormValues) => {
	const dynamicKey = extractDynamicKey(values.url);

	let url = values.url;
	if (dynamicKey) {
		const template = Handlebars.compile(values.url);
		const result = template(JSON.parse(values.inputSampleData));

		url = result;
	}

	return {
		url,
		hasDynamicKey: !!dynamicKey
	};
};

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

	const handleOnSubmit = (data: LookupHttpRequestFormValues) => {
		let method: HttpMethod = { get: null };
		if (data.method === 'POST') {
			method = { post: null };
		}

		const { url, hasDynamicKey } = getUrlValue(data);

		onProcessNode({
			LookupHttpRequest: {
				cycles: BigInt(data.cycles),
				description: data.description.length ? [data.description] : [],
				headers: data.headers.map(header => [header.key, header.value]),
				method,
				name: data.name,
				request_body: data.requestBody.length ? [data.requestBody] : [],
				sample_data: data.inputSampleData,
				url,
				dynamic_url: hasDynamicKey ? [data.url] : []
			}
		});
	};

	return (
		<Form<LookupHttpRequestFormValues>
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
			render={({ watch, getValues }) => (
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
									endElement={<Icon fontSize="small" icon="info" tooltip={<HandlebarsInfo />} />}
									placeholder="https://api.example.com/v1/data"
									helperText={
										watch('url').includes('{{') && watch('url').includes('}}')
											? getUrlValue(getValues()).url
											: undefined
									}
								/>
								<Select
									name="method"
									label="Method"
									options={HTTP_METHODS.map(method => ({ id: method, label: method }))}
								/>
								<Stack direction="column" spacing={0.25}>
									<Stack direction="row" spacing={1} alignItems="center">
										<FormLabel>Request Body</FormLabel>
										<Icon fontSize="small" icon="info" tooltip={<HandlebarsInfo />} />
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
			)}
		/>
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
	const { getValues, setValue, trigger } = useFormContext<LookupHttpRequestFormValues>();
	const { mutate: preview, data, error, isPending: isPreviewPending } = useLookupHttpRequestPreview();

	useEffect(() => {
		if (!data) {
			return;
		}

		const key = `Node:${nodesLength}`;
		const inputSampleData = getValues('inputSampleData');

		if (error) {
			setValue('inputSampleData', stringifyJson({ ...JSON.parse(inputSampleData), [key]: error }));
			return;
		}

		if ('Ok' in data) {
			setValue('inputSampleData', stringifyJson({ ...JSON.parse(inputSampleData), [key]: JSON.parse(data.Ok) }));
			return;
		}

		setValue('inputSampleData', stringifyJson({ ...JSON.parse(inputSampleData), [key]: data }));
	}, [data, error, getValues, nodesLength, setValue]);

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

					let method: HttpMethod = { get: null };
					if (values.method === 'POST') {
						method = { post: null };
					}

					preview({
						cycles: BigInt(values.cycles),
						headers: values.headers.map(header => [header.key, header.value]),
						method,
						request_body: values.requestBody.length ? [values.requestBody] : [],
						url: getUrlValue(values).url
					});
				}}
			>
				Send preview request
			</Button>
		</>
	);
};