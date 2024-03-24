import { Divider, Paper, Stack } from '@mui/material';
import { Form } from 'components/Form';
import { Option, Select } from 'components/Form/Select';
import { Node } from 'lib/types';
import { RefObject, useEffect, useState } from 'react';
import { MapperPinFormValues } from '../NodeDrawers.types';
import { useGetCircuitNodes, useGetParam, useGetSampleData } from 'lib/hooks';
import { getSampleDataFields, getPin, stringifyJson } from 'lib/utils';
import { MapperPin } from 'declarations/nodes.declarations';
import { OVERFLOW } from 'lib/constants';
import { B1, H5 } from 'components/Typography';
import { Button, TextButton } from 'components/Button';
import { Editor, StandaloneEditor } from 'components/Editor';
import { UseFormSetValue, useFieldArray, useFormContext } from 'react-hook-form';
import { SkeletonMapperPinField } from 'components/Skeleton';
import { Alert, TipAlert } from 'components/Alert';
import { IconButton } from 'components/IconButton';
import { Field } from 'components/Form/Field';

export const MapperPinDrawerForm = ({ formRef, node }: { formRef: RefObject<HTMLFormElement>; node: Node }) => {
	const action = useGetParam('action');
	const circuitId = useGetParam('circuitId');

	const { data: circuitNodes } = useGetCircuitNodes(Number(circuitId));
	const { isFetching: isSampleDataFetching, refetch: refetchSampleData } = useGetSampleData(
		{ circuitId: Number(circuitId), nodes: circuitNodes ?? [] },
		{ enabled: false }
	);

	const [outputSampleData, setOutputSampleData] = useState('');

	const getFields = (sampleData: string): Option[] => {
		// If there's no sample data, return an empty array
		if (!sampleData.length) {
			return [];
		}

		try {
			// Get the fields from the input sample data
			return getSampleDataFields(JSON.parse(sampleData));
		} catch (error) {
			return [];
		}
	};

	const handleOnPreview = (formValues: MapperPinFormValues) => {
		try {
			let outputString = 'The filter condition is ';

			setOutputSampleData(stringifyJson(formValues));
		} catch (error) {
			setOutputSampleData((error as Error).message);
		}
	};

	// Fetch sample data
	const handleOnFetchSampleData = async (setValueInForm: UseFormSetValue<MapperPinFormValues>) => {
		const { data: sampleData } = await refetchSampleData();
		setValueInForm('inputSampleData', stringifyJson(sampleData));
	};

	return (
		<Form<MapperPinFormValues>
			action={data => console.log({ data })}
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
			myRef={formRef}
			render={({ getValues, setValue }) => (
				<Stack
					direction="row"
					spacing={4}
					sx={{
						overflowY: 'auto',
						minHeight: 'calc(100vh - 205px)'
					}}
				>
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
							{action === 'edit' && !getValues().inputSampleData ? (
								<B1>
									Please use the{' '}
									<TextButton onClick={() => handleOnFetchSampleData(setValue)}>Collect Sample Data</TextButton> button
									to collect sample data
								</B1>
							) : (
								<>
									{isSampleDataFetching ? (
										<SkeletonMapperPinField />
									) : (
										<Fields fields={getFields(getValues('inputSampleData'))} />
									)}
								</>
							)}
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
									disabled={isSampleDataFetching || !getValues().inputSampleData}
									onClick={() => handleOnPreview(getValues())}
								>
									Preview
								</Button>
							</Stack>
							<TipAlert>You can also insert the sample data yourself to save Cycles.</TipAlert>
							<Editor name="inputSampleData" mode="javascript" height={250} />
						</Stack>
						<Stack direction="column" spacing={2}>
							<H5 fontWeight="bold">Output</H5>
							<StandaloneEditor mode="javascript" isReadOnly value={outputSampleData} height={250} />
						</Stack>
					</Stack>
				</Stack>
			)}
		/>
	);
};

const Fields = ({ fields }: { fields: Option[] }) => {
	const { fields: formFields, append, remove } = useFieldArray<MapperPinFormValues>({ name: 'fields' });

	return (
		<Stack spacing={1} padding={1}>
			<Stack spacing={2}>
				{formFields.map((field, index) => (
					<Stack key={field.id} direction="row" spacing={1} alignItems="center">
						<Select fullWidth name={`field.${index}.input`} label="Input" options={fields} />
						<Field fullWidth name={`field.${index}.ouput`} label="Ouput" />
						<IconButton
							disabled={formFields.length === 1}
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
					{!formFields.length ? 'Add first mapper' : 'Add mapper'}
				</Button>
			</Stack>
		</Stack>
	);
};
