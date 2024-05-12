import { Divider, FormHelperText, Paper, Stack } from '@mui/material';
import { Form } from 'components/Form';
import { Node, PinSourceType } from 'lib/types';
import { RefObject, useEffect, useState } from 'react';
import { MapperPinFormValues } from '../NodeDrawers.types';
import { generateNodeIndexKey, getMapperPinFormValues, getPin, stringifyJson } from 'lib/utils';
import { MapperPin, Pin } from 'declarations/nodes.declarations';
import { OVERFLOW, OVERFLOW_FIELDS, POPULATE_SAMPLE_DATA } from 'lib/constants';
import { H5 } from 'components/Typography';
import { Button } from 'components/Button';
import { Editor, StandaloneEditor } from 'components/Editor';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Alert, TipAlert } from 'components/Alert';
import { IconButton } from 'components/IconButton';
import { Field } from 'components/Form/Field';
import createMapper from 'map-factory';
import lodashMerge from 'lodash/merge';
import { mapperPinSchema } from 'lib/schemas';
import { useGetCircuitNodes, useGetParam } from 'lib/hooks';
import { getSampleData } from 'api/nodes.api';
import { useParams } from 'react-router-dom';

export const MapperPinDrawerForm = ({
	formRef,
	node,
	mapperType,
	onProcessMapper
}: {
	formRef: RefObject<HTMLFormElement>;
	node: Node;
	mapperType: 'PreMapperPin' | 'PostMapperPin';
	onProcessMapper: (data: Pin) => void;
}) => {
	const [outputSampleData, setOutputSampleData] = useState('');

	const circuitId = useGetParam('circuitId');
	const { data: circuitNodes } = useGetCircuitNodes(Number(circuitId));

	const handleOnPreview = async (formValues: MapperPinFormValues) => {
		try {
			const parsedInput = JSON.parse(formValues.inputSampleData);

			const mapper = createMapper();
			formValues.fields.forEach(field => {
				if (field.input.length && field.output.length) {
					const inputField = field.input.replace('[*]', '[]');
					const outputField = field.output.replace('[*]', '[]');

					mapper.map(inputField).to(outputField);
				}
			});

			const index = circuitNodes?.findIndex(({ id }) => id === node.id) ?? 0;
			const output = mapper.execute(parsedInput);
			const merged = lodashMerge(parsedInput, {
				[generateNodeIndexKey(index)]: {
					[mapperType]: output
				}
			});

			setOutputSampleData(stringifyJson(merged));
		} catch (error) {
			setOutputSampleData((error as Error).message);
		}
	};

	const handleOnSubmit = (data: MapperPinFormValues) => {
		const values: MapperPin = {
			sample_data: data.inputSampleData,
			fields: data.fields.map(field => [field.input, field.output])
		};

		onProcessMapper({
			order: 0,
			pin_type: mapperType === 'PostMapperPin' ? { PostMapperPin: values } : { PreMapperPin: values }
		});
	};

	return (
		<Form<MapperPinFormValues>
			action={handleOnSubmit}
			defaultValues={() => {
				const mapperPin = getPin<MapperPin>(node, mapperType);
				const formValues = getMapperPinFormValues(mapperPin);

				return formValues;
			}}
			schema={mapperPinSchema}
			myRef={formRef}
			render={({ getValues, clearErrors, trigger, formState: { errors } }) => (
				<Stack direction="row" spacing={4} sx={OVERFLOW_FIELDS}>
					<FormValuesUpdater />
					<Stack direction="column" spacing={2} width="50%" sx={{ ...OVERFLOW, pr: 1 }}>
						<Alert severity="info">
							{mapperType === 'PreMapperPin'
								? "A PreMapper Pin allows you to map a value from the input to a value in the output, before the Node's execution."
								: "A PostMapper Pin allows you to map a value from the input to a value in the output, after the Node's execution"}
						</Alert>
						<H5 fontWeight="bold">Fields</H5>
						<Paper sx={{ p: 2 }}>
							<Fields onClearError={() => clearErrors('fields')} />
						</Paper>
						{errors.fields && <FormHelperText error>{errors.fields.message}</FormHelperText>}
					</Stack>
					<Divider orientation="vertical" flexItem />
					<Stack direction="column" spacing={4} width="50%" height="100%" sx={{ ...OVERFLOW, pr: 1 }}>
						<Stack direction="column" spacing={2}>
							<H5 fontWeight="bold">Input</H5>
							<Button
								fullWidth
								variant="contained"
								size="large"
								startIcon="filter-linear"
								onClick={async () => {
									const isValid = await trigger();
									if (!isValid) {
										return;
									}

									handleOnPreview(getValues());
								}}
							>
								Preview
							</Button>
							<TipAlert>{POPULATE_SAMPLE_DATA}</TipAlert>
							<Editor name="inputSampleData" mode="javascript" height={300} />
						</Stack>
						<Stack direction="column" spacing={2}>
							<H5 fontWeight="bold">Output</H5>
							<StandaloneEditor
								id="mapper-pin-output-sample-data"
								mode="javascript"
								isReadOnly
								value={outputSampleData}
								height={300}
							/>
						</Stack>
					</Stack>
				</Stack>
			)}
		/>
	);
};

const FormValuesUpdater = () => {
	const { circuitId, nodeId, pinType } = useParams<{
		circuitId: string;
		nodeId: string;
		pinType: PinSourceType;
	}>();

	const { data: circuitNodes } = useGetCircuitNodes(Number(circuitId));
	const { setValue } = useFormContext<MapperPinFormValues>();

	useEffect(() => {
		if (!circuitNodes || !nodeId || !pinType) {
			return;
		}

		const init = async () => {
			// Get previous nodes before the current node
			// In case of PostMapperPin, we need to include the current node
			const index = circuitNodes.findIndex(({ id }) => id === Number(nodeId));
			const previousNodes = circuitNodes.slice(0, pinType === 'PreMapperPin' ? index : index + 1);

			const collectedSampleData = await getSampleData(previousNodes, {
				skipNodes: ['LookupCanister', 'LookupHttpRequest'],
				includePostMapper: pinType === 'PreMapperPin'
			});

			setValue('inputSampleData', stringifyJson(collectedSampleData));
		};

		init();
	}, [circuitNodes, pinType, nodeId, setValue]);

	return null;
};

const Fields = ({ onClearError }: { onClearError: () => void }) => {
	const { fields, append, remove } = useFieldArray<MapperPinFormValues>({ name: 'fields' });

	return (
		<Stack spacing={2}>
			{fields.map((field, index) => (
				<Stack key={field.id} direction="row" spacing={1} alignItems="center">
					<Field fullWidth name={`fields.${index}.input`} label="Input" />
					<Field fullWidth name={`fields.${index}.output`} label="Ouput" />
					<IconButton disabled={fields.length === 1} icon="close-linear" color="error" onClick={() => remove(index)} />
				</Stack>
			))}
			<Button
				startIcon="add-linear"
				sx={{ width: 'fit-content' }}
				variant="outlined"
				size="large"
				onClick={() => {
					if (fields.length === 0) {
						onClearError();
					}

					append({ input: '', output: '' }, { shouldFocus: false });
				}}
			>
				Add mapper
			</Button>
		</Stack>
	);
};
