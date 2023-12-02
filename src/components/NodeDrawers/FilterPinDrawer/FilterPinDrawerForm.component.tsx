import { Alert, Divider, Paper, Stack } from '@mui/material';
import { Editor } from 'components/Editor';
import { Form } from 'components/Form';
import { Field } from 'components/Form/Field';
import { Select, Option } from 'components/Form/Select';
import { B1, H5 } from 'components/Typography';
import { DataType, Node, OperandType, OperatorType } from 'lib/types';
import { RefObject, useEffect, useMemo, useState } from 'react';
import { FilterPinFormValues } from '../NodeDrawers.types';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { StandaloneCheckbox } from 'components/Form/Checkbox';
import { RadioButton } from 'components/Form/RadioButton';
import { Button, TextButton } from 'components/Button';
import { IconButton } from 'components/IconButton';
import { Dialog } from 'components/Dialog';
import { useGetSampleData } from 'lib/hooks';
import { getFilterPinValuesAsArg, getSampleDataFields, getFilterPinFormValues, isFilterTrue, getPin } from 'lib/utils';
import { FilterPin, Pin } from 'declarations/nodes.declarations';
import { filterPinSchema } from 'lib/schemas';
import { SkeletonRules } from 'components/Skeleton';
import { OVERFLOW } from 'lib/constants';

const operators: Option<OperatorType>[] = [
	{
		id: 'Equal',
		label: 'Equal'
	},
	{
		id: 'LessThanOrEqual',
		label: 'Less Than Or Equal'
	},
	{
		id: 'GreaterThan',
		label: 'Greater Than'
	},
	{
		id: 'LessThan',
		label: 'Less Than'
	},
	{
		id: 'GreaterThanOrEqual',
		label: 'Greater Than Or Equal'
	},
	{
		id: 'NotEqual',
		label: 'Not Equal'
	},
	{
		id: 'Contains',
		label: 'Contains'
	}
];

const operandTypes: Option<OperandType>[] = [
	{
		id: 'Value',
		label: 'Value'
	},
	{
		id: 'Field',
		label: 'Field'
	}
];

const dataTypes: Option<DataType>[] = [
	{
		id: 'String',
		label: 'String'
	},
	{
		id: 'Number',
		label: 'Number'
	},
	{
		id: 'Boolean',
		label: 'Boolean'
	},
	{
		id: 'Principal',
		label: 'Principal'
	},
	{
		id: 'BigInt',
		label: 'BigInt'
	}
];

export const FilterPinDrawerForm = ({
	formRef,
	node,
	onProcessFilter
}: {
	formRef: RefObject<HTMLFormElement>;
	node: Node;
	onProcessFilter: (data: Pin) => void;
}) => {
	const [isRefetch, setIsRefetch] = useState(false);

	// Store the sample data as a string in a seperate state for the editor in case the user wants to edit it
	const [inputSampleData, setInputSampleData] = useState('');
	const [outputSampleData, setOutputSampleData] = useState('');

	const {
		data: sampleData,
		isLoading: isSampleDataLoading,
		isFetching: isSampleDataRefetching,
		refetch: refetchSampleData
	} = useGetSampleData(node.id, {
		options: {
			isFilterPreview: true
		},
		queryOptions: {
			// Set to false to prevent the query from running on component mount
			// This is to save unnecessary cycle waste
			enabled: false
		}
	});

	useEffect(() => {
		if (!sampleData) {
			return;
		}

		// Set the sample data as the input value for the editor
		setInputSampleData(JSON.stringify(sampleData, null, 4));
	}, [sampleData, isRefetch]);

	const fields = useMemo((): Option[] => {
		if (!inputSampleData) {
			return [];
		}

		try {
			// Get the fields from the input sample data
			return getSampleDataFields(JSON.parse(inputSampleData));
		} catch (error) {
			// If there's an error, return an error option
			return [
				{
					id: 'error',
					label: (error as Error).message,
					disabled: true
				}
			];
		}
	}, [inputSampleData]);

	const handleOnSubmit = (data: FilterPinFormValues) => {
		onProcessFilter({
			order: 0,
			pin_type: {
				FilterPin: {
					condition: data.condition === 'Is' ? { Is: null } : { Not: null },
					condition_group: data.conditionGroup ? [data.conditionGroup === 'And' ? { And: null } : { Or: null }] : [],
					rules: getFilterPinValuesAsArg(data.rules)
				}
			}
		});
	};

	const handleOnPreview = (formValues: FilterPinFormValues) => {
		if (!inputSampleData) {
			return;
		}

		try {
			const isTrue = isFilterTrue(formValues, JSON.parse(inputSampleData));

			let outputString = 'The filter condition is ';
			if (isTrue) {
				outputString += 'true. It will be executed.';
			} else {
				outputString += 'false. It will not be executed.';
			}

			setOutputSampleData(outputString);
		} catch (error) {
			setOutputSampleData((error as Error).message);
		}
	};

	// Refetch the sample data
	// This is to update the sample data when the user changes the circuit and the sample data is no longer valid
	const handleOnRefetch = async () => {
		setIsRefetch(true);
		await refetchSampleData();
		setIsRefetch(false);
	};

	const isSampleDataLoaded = !!sampleData && !isSampleDataLoading && !isSampleDataRefetching;

	return (
		<Form<FilterPinFormValues>
			action={handleOnSubmit}
			defaultValues={() => {
				const filterPin = getPin<FilterPin>(node, 'FilterPin');
				return getFilterPinFormValues(filterPin);
			}}
			schema={filterPinSchema}
			myRef={formRef}
			render={({ getValues }) => (
				<Stack direction="row" spacing={4} height="100%">
					<Stack direction="column" spacing={2} width="50%" sx={OVERFLOW}>
						<Alert severity="info">
							A Filter Pin node filters the node according to the specified rules below. If these rules are met, the
							node's execution can be prevented.
						</Alert>
						<H5 fontWeight="bold">Rules</H5>
						<Paper
							sx={{
								p: 2
							}}
						>
							{sampleData ? (
								<Rules fields={fields} />
							) : sampleData && isSampleDataLoading ? (
								<SkeletonRules />
							) : (
								<B1>
									Please use the <TextButton onClick={handleOnRefetch}>Collect Sample Data</TextButton> button to
									collect sample data
								</B1>
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
									loading={isSampleDataRefetching}
									size="large"
									onClick={handleOnRefetch}
									tooltip="Collecting Sample Data might consume cycles if there's a Lookup Node in the circuit."
								>
									Collect Sample Data
								</Button>
								<Button
									fullWidth
									variant="contained"
									size="large"
									startIcon="filter-linear"
									disabled={!isSampleDataLoaded}
									onClick={() => handleOnPreview(getValues())}
								>
									Preview
								</Button>
							</Stack>
							<Editor
								mode="javascript"
								value={inputSampleData}
								height={450}
								onChange={value => {
									// Set the input sample data as the value of the editor
									setInputSampleData(value);
								}}
							/>
						</Stack>
						<Stack direction="column" spacing={2}>
							<H5 fontWeight="bold">Output</H5>
							<Editor mode="javascript" isReadOnly value={outputSampleData} height={32} />
						</Stack>
					</Stack>
				</Stack>
			)}
		/>
	);
};

const Rules = ({ fields }: { fields: Option[] }) => {
	const [fieldSettingsIndex, setFieldSettingsIndex] = useState<number | null>(null);
	const [isFieldHover, setIsFieldHover] = useState<Record<number, boolean>>({});

	const { fields: formFields, append, remove } = useFieldArray({ name: 'rules' });
	const { watch, setValue } = useFormContext<FilterPinFormValues>();
	const values = watch();

	useEffect(() => {
		if (formFields.length > 1) {
			setValue('conditionGroup', 'And');
		} else if (formFields.length === 1) {
			setValue('conditionGroup', null);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formFields.length]);

	return (
		<>
			<Stack spacing={1} padding={1}>
				<Stack direction="row" columnGap={2} width="100%" alignItems="flex-start">
					<StandaloneCheckbox
						name="condition"
						label="Not"
						checked={values.condition === 'Not'}
						onChange={checked => setValue('condition', checked ? 'Not' : 'Is')}
					/>
					<RadioButton
						disabled={formFields.length === 1}
						row
						name="conditionGroup"
						options={[
							{
								id: 'And',
								label: 'And'
							},
							{
								id: 'Or',
								label: 'Or'
							}
						]}
					/>
					<Button
						variant="contained"
						size="small"
						sx={{ ml: 'auto' }}
						onClick={() =>
							append({
								field: '',
								operator: '',
								value: '',
								dataType: 'String',
								operandType: 'Value'
							})
						}
					>
						Add rule
					</Button>
				</Stack>
				<Stack spacing={2}>
					{formFields.map((field, index) => (
						<Stack key={field.id} direction="row" spacing={1} alignItems="center">
							<Select fullWidth name={`rules.${index}.field`} label="Field" options={fields} />
							<Select fullWidth name={`rules.${index}.operator`} label="Operator" options={operators} />
							<Stack
								direction="row"
								spacing={1}
								alignItems="center"
								width="100%"
								onMouseEnter={() => setIsFieldHover({ ...isFieldHover, [index]: true })}
								onMouseLeave={() => setIsFieldHover({ ...isFieldHover, [index]: false })}
							>
								{values.rules[index].operandType === 'Field' ? (
									<Select fullWidth name={`rules.${index}.value`} label="Value" options={fields} />
								) : (
									<Field fullWidth name={`rules.${index}.value`} label="Value" />
								)}
								<IconButton
									icon="settings"
									onClick={() => setFieldSettingsIndex(index)}
									disabled={!isFieldHover[index]}
								/>
							</Stack>
							<IconButton
								disabled={formFields.length === 1}
								icon="close-linear"
								color="error"
								onClick={() => remove(index)}
							/>
						</Stack>
					))}
				</Stack>
			</Stack>
			<Dialog
				title="Field Settings"
				open={fieldSettingsIndex !== null}
				onClose={() => setFieldSettingsIndex(null)}
				onCancelText="Back"
				onConfirmText="Save"
			>
				<Stack spacing={4} mt={2}>
					<Select
						fullWidth
						name={`rules.${fieldSettingsIndex}.operandType`}
						label="Operand type"
						options={operandTypes}
					/>
					<Select fullWidth name={`rules.${fieldSettingsIndex}.dataType`} label="Data type" options={dataTypes} />
				</Stack>
			</Dialog>
		</>
	);
};
