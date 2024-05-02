import { Divider, Paper, Stack } from '@mui/material';
import { Form } from 'components/Form';
import { Node } from 'lib/types';
import { RefObject, useState } from 'react';
import { MapperPinFormValues } from '../NodeDrawers.types';
import { useGetCircuitNodes, useGetParam, useGetSampleData } from 'lib/hooks';
import { getPin, stringifyJson } from 'lib/utils';
import { MapperPin, Pin } from 'declarations/nodes.declarations';
import { OVERFLOW, OVERFLOW_FIELDS, POPULATE_SAMPLE_DATA } from 'lib/constants';
import { H5 } from 'components/Typography';
import { Button } from 'components/Button';
import { Editor, StandaloneEditor } from 'components/Editor';
import { UseFormSetValue, useFieldArray } from 'react-hook-form';
import { SkeletonMapperPinField } from 'components/Skeleton';
import { Alert, TipAlert } from 'components/Alert';
import { IconButton } from 'components/IconButton';
import { Field } from 'components/Form/Field';
import createMapper from 'map-factory';
import lodashMerge from 'lodash/merge';
import { mapperPinSchema } from 'lib/schemas';

export const MapperPinDrawerForm = ({
	formRef,
	node,
	onProcessMapper
}: {
	formRef: RefObject<HTMLFormElement>;
	node: Node;
	onProcessMapper: (data: Pin) => void;
}) => {
	const circuitId = useGetParam('circuitId');

	const { data: circuitNodes } = useGetCircuitNodes(Number(circuitId));
	const { isFetching: isSampleDataFetching, refetch: refetchSampleData } = useGetSampleData(
		{ circuitId: Number(circuitId), nodes: circuitNodes ?? [] },
		{ enabled: false }
	);

	const [outputSampleData, setOutputSampleData] = useState('');

	const handleOnPreview = (formValues: MapperPinFormValues) => {
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

			const output = mapper.execute(parsedInput);
			setOutputSampleData(stringifyJson(lodashMerge(parsedInput, output)));
		} catch (error) {
			setOutputSampleData((error as Error).message);
		}
	};

	// Fetch sample data
	const handleOnFetchSampleData = async (setValueInForm: UseFormSetValue<MapperPinFormValues>) => {
		const { data: sampleData } = await refetchSampleData();
		setValueInForm('inputSampleData', stringifyJson(sampleData));
	};

	const handleOnSubmit = (data: MapperPinFormValues) => {
		onProcessMapper({
			order: 0,
			pin_type: {
				MapperPin: {
					sample_data: [data.inputSampleData],
					fields: data.fields.map(field => [field.input, field.output])
				}
			}
		});
	};

	return (
		<Form<MapperPinFormValues>
			action={handleOnSubmit}
			defaultValues={() => {
				const mapperPin = getPin<MapperPin>(node, 'MapperPin');

				if (!mapperPin) {
					return {
						inputSampleData: '',
						fields: []
					};
				}

				return {
					inputSampleData: mapperPin.sample_data[0] ?? '',
					fields: mapperPin.fields.map(field => ({
						input: field[0],
						output: field[1]
					}))
				};
			}}
			schema={mapperPinSchema}
			myRef={formRef}
			render={({ getValues, setValue }) => (
				<Stack direction="row" spacing={4} sx={OVERFLOW_FIELDS}>
					<Stack direction="column" spacing={2} width="50%" sx={OVERFLOW}>
						<Alert severity="info">
							A Mapper Pin allows you to map a value from the input to a value in the output.
						</Alert>
						<H5 fontWeight="bold">Fields</H5>
						<Paper
							sx={{
								p: 2
							}}
						>
							{isSampleDataFetching ? <SkeletonMapperPinField /> : <Fields />}
						</Paper>
					</Stack>
					<Divider orientation="vertical" flexItem />
					<Stack direction="column" spacing={4} width="50%" height="100%">
						<Stack direction="column" spacing={2}>
							<H5 fontWeight="bold">Input</H5>
							<Stack direction="row" spacing={1}>
								<Button
									fullWidth
									variant="outlined"
									size="large"
									loading={isSampleDataFetching}
									onClick={() => handleOnFetchSampleData(setValue)}
									tooltip="This action will activate every node within this circuit. Collecting Sample Data might consume cycles if there's one or more Lookup Nodes in the circuit."
								>
									Collect Sample Data
								</Button>
								<Button
									fullWidth
									variant="contained"
									size="large"
									startIcon="filter-linear"
									disabled={isSampleDataFetching}
									onClick={() => handleOnPreview(getValues())}
								>
									Preview
								</Button>
							</Stack>
							<TipAlert>{POPULATE_SAMPLE_DATA}</TipAlert>
							<Editor name="inputSampleData" mode="javascript" height={250} />
						</Stack>
						<Stack direction="column" spacing={2}>
							<H5 fontWeight="bold">Output</H5>
							<StandaloneEditor
								id="mapper-pin-output-sample-data"
								mode="javascript"
								isReadOnly
								value={outputSampleData}
								height={500}
							/>
						</Stack>
					</Stack>
				</Stack>
			)}
		/>
	);
};

const Fields = () => {
	const { fields, append, remove } = useFieldArray<MapperPinFormValues>({ name: 'fields' });

	return (
		<Stack spacing={1} padding={1}>
			<Stack spacing={2}>
				{fields.map((field, index) => (
					<Stack key={field.id} direction="row" spacing={1} alignItems="center">
						<Field fullWidth name={`fields.${index}.input`} label="Input" />
						<Field fullWidth name={`fields.${index}.output`} label="Ouput" />
						<IconButton
							disabled={fields.length === 1}
							icon="close-linear"
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
					onClick={() => append({ input: '', output: '' })}
				>
					{!fields.length ? 'Add first mapper' : 'Add mapper'}
				</Button>
			</Stack>
		</Stack>
	);
};
