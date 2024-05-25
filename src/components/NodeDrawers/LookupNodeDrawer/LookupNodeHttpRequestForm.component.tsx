import { Box, Divider, FormLabel, Stack } from '@mui/material';
import { RefObject, useState } from 'react';
import { Form } from 'components/Form';
import { Field } from 'components/Form/Field';
import { H5 } from 'components/Typography';
import { Node } from 'lib/types';
import { HttpRequestMethod, NodeType } from 'declarations/nodes.declarations';
import { LookupHttpRequestFormValues } from '../NodeDrawers.types';
import { useFormContext } from 'react-hook-form';
import {
	extractDynamicKey,
	getHandlebars,
	getLookupHTTRequestFormValues,
	isHandlebarsTemplate,
	parseJson
} from 'lib/utils';
import { Button } from 'components/Button';
import { Select } from 'components/Form/Select';
import { HTTP_METHODS, OVERFLOW, OVERFLOW_FIELDS, POPULATE_SAMPLE_DATA } from 'lib/constants';
import { Alert, TipAlert } from 'components/Alert';
import { Editor } from 'components/Editor';
import { useLookupHttpRequestPreview, useLookupNodePreview } from 'lib/hooks';
import { lookupHttpRequestSchema } from 'lib/schemas';
import { Icon } from 'components/Icon';
import { HandlebarsInfo, HttpRequestHeaders, WithLiveEditor } from 'components/Shared';
import { StandaloneCheckbox } from 'components/Form/Checkbox';
import { LookupNodeFormValuesUpdater } from './LookupNodeCanisterForm.component';

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
		let method: HttpRequestMethod = { GET: null };
		if (data.method === 'POST') {
			method = { POST: null };
		} else if (data.method === 'PUT') {
			method = { PUT: null };
		} else if (data.method === 'DELETE') {
			method = { DELETE: null };
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
					<LookupNodeFormValuesUpdater />
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
									placeholder="https://api.example.com/v1/data"
									helperText={
										<Stack alignItems="flex-start" spacing={1}>
											<HandlebarsInfo />
											<span>{isHandlebarsTemplate(watch('url')) ? getUrlValue(getValues()) : undefined}</span>
										</Stack>
									}
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
												label="Live Preview"
												name="livePreview"
												checked={isLivePreview}
												onChange={setIsLivePreview}
											/>
										</Box>
									</Stack>
									<WithLiveEditor
										input={watch('requestBody')}
										context={watch('inputSampleData')}
										isLivePreview={isLivePreview}
										editorProps={{
											name: 'requestBody',
											mode: 'handlebars',
											height: 150,
											ignoreInvalidJSON: true
										}}
										liveEditorProps={{
											name: 'requestBodyLivePreview',
											mode: 'javascript',
											height: 150,
											isReadOnly: true
										}}
										stackProps={{
											direction: 'column'
										}}
									/>
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

					let method: HttpRequestMethod = { GET: null };
					if (values.method === 'POST') {
						method = { POST: null };
					} else if (values.method === 'PUT') {
						method = { PUT: null };
					} else if (values.method === 'DELETE') {
						method = { DELETE: null };
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
