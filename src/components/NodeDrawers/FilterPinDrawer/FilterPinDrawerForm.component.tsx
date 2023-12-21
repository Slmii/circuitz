import { Alert, Divider, Paper, Stack } from '@mui/material';
import { StandaloneEditor, Editor } from 'components/Editor';
import { Form } from 'components/Form';
import { Field } from 'components/Form/Field';
import { Select, Option } from 'components/Form/Select';
import { B1, H5 } from 'components/Typography';
import { Node } from 'lib/types';
import { RefObject, useEffect, useState } from 'react';
import { FilterPinFormValues } from '../NodeDrawers.types';
import { UseFormSetValue, useFieldArray, useFormContext } from 'react-hook-form';
import { StandaloneCheckbox } from 'components/Form/Checkbox';
import { RadioButton } from 'components/Form/RadioButton';
import { Button, TextButton } from 'components/Button';
import { IconButton } from 'components/IconButton';
import { Dialog } from 'components/Dialog';
import { useGetCircuitNodes, useGetParam } from 'lib/hooks';
import { getFilterPinValuesAsArg, getSampleDataFields, getFilterPinFormValues, isFilterTrue, getPin } from 'lib/utils';
import { FilterPin, Pin } from 'declarations/nodes.declarations';
import { filterPinSchema } from 'lib/schemas';
import { SkeletonRules } from 'components/Skeleton';
import { OVERFLOW } from 'lib/constants';
import { api } from 'api/index';
import { DATA_TYPES, OPERAND_TYPES, OPERATORS } from './FilterPin.constants';

export const FilterPinDrawerForm = ({
	formRef,
	node,
	filterType,
	onProcessFilter
}: {
	formRef: RefObject<HTMLFormElement>;
	node: Node;
	filterType: 'FilterPin' | 'LookupFilterPin';
	onProcessFilter: (data: Pin) => void;
}) => {
	const action = useGetParam('action');
	const circuitId = useGetParam('circuitId');
	const { data: circuitNodes } = useGetCircuitNodes(Number(circuitId));

	const [isFetchingSampleData, setIsFetchingSampleData] = useState(false);
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

	const handleOnSubmit = (data: FilterPinFormValues) => {
		const values: FilterPin = {
			condition: data.condition === 'Is' ? { Is: null } : { Not: null },
			condition_group: data.conditionGroup ? [data.conditionGroup === 'And' ? { And: null } : { Or: null }] : [],
			rules: getFilterPinValuesAsArg(data.rules),
			sample_data: [data.inputSampleData]
		};

		onProcessFilter({
			order: 0,
			pin_type: filterType === 'FilterPin' ? { FilterPin: values } : { LookupFilterPin: values }
		});
	};

	const handleOnPreview = (formValues: FilterPinFormValues) => {
		try {
			const isTrue = isFilterTrue(formValues);

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

	// Fetch sample data
	const handleOnFetchSampleData = async (setValueInForm: UseFormSetValue<FilterPinFormValues>) => {
		if (!circuitNodes) {
			return;
		}

		setIsFetchingSampleData(true);

		// Get the sample data from the nodes that are before and including the current node
		const sampleData = await api.Nodes.getSampleData(circuitNodes.filter(({ id }) => id <= node.id));

		setValueInForm('inputSampleData', JSON.stringify(sampleData, null, 4));

		setIsFetchingSampleData(false);
	};

	return (
		<Form<FilterPinFormValues>
			action={handleOnSubmit}
			defaultValues={() => {
				const filterPin = getPin<FilterPin>(node, filterType);
				return getFilterPinFormValues(filterPin);
			}}
			schema={filterPinSchema}
			myRef={formRef}
			render={({ getValues, setValue }) => (
				<Stack direction="row" spacing={4} height="100%">
					<Stack direction="column" spacing={2} width="50%" sx={OVERFLOW}>
						<Alert severity="info">
							{filterType === 'FilterPin'
								? "A Filter Pin node filters the node according to the specified rules below. If these rules are met, the node's execution can be triggered."
								: 'A Lookup Filter Pin node filters the node according to the specified rules below. If these rules are met, the Lookup values will not be merged into the next Node.'}
						</Alert>
						<H5 fontWeight="bold">Rules</H5>
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
									{isFetchingSampleData ? <SkeletonRules /> : <Rules fields={getFields(getValues().inputSampleData)} />}
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
									loading={isFetchingSampleData}
									size="large"
									onClick={() => handleOnFetchSampleData(setValue)}
									tooltip="This action will activate every node within this circuit. Collecting Sample Data might consume cycles if there's a Lookup Node in the circuit."
								>
									Collect Sample Data
								</Button>
								<Button
									fullWidth
									variant="contained"
									size="large"
									startIcon="filter-linear"
									disabled={isFetchingSampleData || !getValues().inputSampleData}
									onClick={() => handleOnPreview(getValues())}
								>
									Preview
								</Button>
							</Stack>
							<Editor name="inputSampleData" mode="javascript" height={450} />
						</Stack>
						<Stack direction="column" spacing={2}>
							<H5 fontWeight="bold">Output</H5>
							<StandaloneEditor mode="javascript" isReadOnly value={outputSampleData} height={32} />
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
							<Select fullWidth name={`rules.${index}.operator`} label="Operator" options={OPERATORS} />
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
						options={OPERAND_TYPES}
					/>
					<Select fullWidth name={`rules.${fieldSettingsIndex}.dataType`} label="Data type" options={DATA_TYPES} />
				</Stack>
			</Dialog>
		</>
	);
};
