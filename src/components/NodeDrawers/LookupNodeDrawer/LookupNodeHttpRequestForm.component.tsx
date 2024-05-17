import { Box, Divider, FormLabel, Paper, Stack } from '@mui/material';
import { RefObject, useEffect, useState } from 'react';
import { Form } from 'components/Form';
import { Field } from 'components/Form/Field';
import { H5 } from 'components/Typography';
import { Node, NodeSourceType } from 'lib/types';
import { HttpMethod, NodeType } from 'declarations/nodes.declarations';
import { LookupHttpRequestFormValues } from '../NodeDrawers.types';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { IconButton } from 'components/IconButton';
import {
	extractDynamicKey,
	getHandlebars,
	getLookupHTTRequestFormValues,
	getPlaceholderNode,
	isHandlebarsTemplate,
	parseJson,
	stringifyJson
} from 'lib/utils';
import { Button } from 'components/Button';
import { Select } from 'components/Form/Select';
import { HTTP_METHODS, OVERFLOW, OVERFLOW_FIELDS, POPULATE_SAMPLE_DATA } from 'lib/constants';
import { Alert, TipAlert } from 'components/Alert';
import { Editor, StandaloneEditor } from 'components/Editor';
import { useGetCircuitNodes, useLookupHttpRequestPreview, useLookupNodePreview } from 'lib/hooks';
import { lookupHttpRequestSchema } from 'lib/schemas';
import { Icon } from 'components/Icon';
import { HandlebarsInfo } from 'components/Shared';
import { StandaloneCheckbox } from 'components/Form/Checkbox';
import { useParams } from 'react-router-dom';
import { getSampleData } from 'api/nodes.api';

const getUrlValue = (values: LookupHttpRequestFormValues) => {
	const dynamicKey = extractDynamicKey(values.url);

	let url = values.url;
	if (dynamicKey) {
		url = getHandlebars(values.url, parseJson(values.inputSampleData));
	}

	return url;
};

const getRequestBodyValue = (values: LookupHttpRequestFormValues) => {
	const dynamicKey = extractDynamicKey(values.requestBody);

	let requestBody = values.requestBody;
	if (dynamicKey) {
		requestBody = getHandlebars(values.requestBody, parseJson(values.inputSampleData));
	}

	return requestBody;
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
	const [isLivePreview, setIsLivePreview] = useState(false);

	const handleOnSubmit = (data: LookupHttpRequestFormValues) => {
		let method: HttpMethod = { get: null };
		if (data.method === 'POST') {
			method = { post: null };
		}

		onProcessNode({
			LookupHttpRequest: {
				cycles: BigInt(data.cycles),
				description: data.description.length ? [data.description] : [],
				headers: data.headers.map(header => [header.key, header.value]),
				method,
				name: data.name,
				request_body: data.requestBody.length ? [data.requestBody] : [],
				sample_data: data.inputSampleData,
				url: data.url
			}
		});
	};

	return (
		<Form<LookupHttpRequestFormValues>
			action={handleOnSubmit}
			defaultValues={() => getLookupHTTRequestFormValues(node)}
			myRef={formRef}
			schema={lookupHttpRequestSchema}
			render={({ watch, getValues }) => (
				<Stack direction="row" spacing={4} sx={OVERFLOW_FIELDS}>
					<FormValuesUpdater />
					<Stack spacing={4} width="50%" sx={{ ...OVERFLOW, pr: 1 }}>
						<Stack direction="column" spacing={2}>
							<Alert severity="info">
								A Lookup HTTP Request Node queries data from an external Web2 API and forwards it to the subsequent Node
								in the Circuit.
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
									helperText={isHandlebarsTemplate(watch('url')) ? getUrlValue(getValues()) : undefined}
								/>
								<Select
									name="method"
									label="Method"
									options={HTTP_METHODS.map(method => ({ id: method, label: method }))}
								/>
								<Stack direction="column" spacing={0.25}>
									<Stack direction="row" justifyContent="space-between">
										<Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
											<FormLabel>Request Body</FormLabel>
											<Icon fontSize="small" icon="info" tooltip={<HandlebarsInfo />} />
										</Stack>
										<Box sx={{ ml: 'auto' }}>
											<StandaloneCheckbox
												label="Live preview"
												name="livePreview"
												checked={isLivePreview}
												onChange={setIsLivePreview}
											/>
										</Box>
									</Stack>
									<Stack
										direction="column"
										spacing={1}
										alignItems="center"
										width="100%"
										sx={{
											'& *': {
												width: '100%'
											}
										}}
									>
										<Editor name="requestBody" mode="handlebars" height={150} ignoreInvalidJSON />
										{isLivePreview && (
											<StandaloneEditor
												isReadOnly
												id="requestBodyPreview"
												value={getHandlebars(watch('requestBody'), parseJson(watch('inputSampleData')))}
												mode="javascript"
												height={150}
											/>
										)}
									</Stack>
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
						<Preview />
						<TipAlert>{POPULATE_SAMPLE_DATA}</TipAlert>
						<Editor name="inputSampleData" mode="javascript" height="50%" />
					</Stack>
				</Stack>
			)}
		/>
	);
};

const FormValuesUpdater = () => {
	const { circuitId, nodeId, nodeType } = useParams<{
		circuitId: string;
		nodeId: string;
		nodeType: NodeSourceType;
	}>();

	const { data: circuitNodes } = useGetCircuitNodes(Number(circuitId));
	const { setValue } = useFormContext<LookupHttpRequestFormValues>();

	useEffect(() => {
		if (!circuitNodes || !nodeType) {
			return;
		}

		const init = async () => {
			// In case of a new node
			// 1. set index to the length of current nodes + 1
			// 2. add a placeholder node and populate the sample data

			// In case of an existing node
			// 1. set index to the index of the node in the array
			// 2. get all the nodes before and including the current node

			const index = nodeId ? circuitNodes.findIndex(({ id }) => id === Number(nodeId)) : circuitNodes.length + 1;
			const previousNodes: Node[] = nodeId
				? circuitNodes.slice(0, index + 1)
				: [
						...circuitNodes,
						{ ...getPlaceholderNode({ circuitId: Number(circuitId), nodeId: index, nodeType: 'LookupHttpRequest' }) }
				  ];

			const collectedSampleData = await getSampleData(previousNodes, {
				skipNodes: ['LookupCanister', 'LookupHttpRequest'],
				includePostMapper: false
			});

			setValue('inputSampleData', stringifyJson(collectedSampleData));
		};

		init();
	}, [circuitNodes, nodeId, setValue, nodeType, circuitId]);

	return null;
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

const Preview = () => {
	const { getValues, trigger } = useFormContext<LookupHttpRequestFormValues>();
	const { mutate: preview, data, error, isPending: isPreviewPending } = useLookupHttpRequestPreview();
	useLookupNodePreview({ nodeType: 'LookupHttpRequest', data, error });

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

					const requestBody = getRequestBodyValue(values);
					const url = getUrlValue(values);

					preview({
						cycles: BigInt(values.cycles),
						headers: values.headers.map(header => [header.key, header.value]),
						method,
						request_body: requestBody.length ? [requestBody] : [],
						url
					});
				}}
			>
				Send preview request
			</Button>
		</>
	);
};
