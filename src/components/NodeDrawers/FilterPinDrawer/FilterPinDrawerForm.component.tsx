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
import { getFilterPinValuesAsArg, getSampleDataFields, getFilterPinFormValues } from 'lib/utils';
import { Pin } from 'declarations/nodes.declarations';
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
	const {
		data: inputData,
		isLoading: isInputDataLoading,
		isFetching: isInputDataRefetching,
		refetch: refetchInputData
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

	const fields = useMemo((): Option[] => {
		if (!inputData) {
			return [];
		}

		return getSampleDataFields(inputData);
	}, [inputData]);

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

	const isSampleDataLoaded = !!inputData && !isInputDataLoading && !isInputDataRefetching;

	return (
		<Form<FilterPinFormValues>
			action={handleOnSubmit}
			defaultValues={getFilterPinFormValues(node)}
			schema={filterPinSchema}
			myRef={formRef}
			render={() => (
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
							{inputData ? (
								<Rules fields={fields} />
							) : inputData && isInputDataLoading ? (
								<SkeletonRules />
							) : (
								<B1>
									Please use the <TextButton onClick={() => refetchInputData()}>Collect Input Data</TextButton> button
									to collect input data
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
									loading={isInputDataRefetching}
									size="large"
									onClick={() => refetchInputData()}
									tooltip="Collecting Input Data might consume cycles if there's a Lookup Node in the circuit."
								>
									Collect Input Data
								</Button>
								<Button
									fullWidth
									variant="contained"
									size="large"
									startIcon="filter-linear"
									disabled={!isSampleDataLoaded}
								>
									Preview
								</Button>
							</Stack>
							<Editor mode="javascript" isReadOnly value={JSON.stringify(inputData, null, 4)} height={450} />
						</Stack>
						<Stack direction="column" spacing={2}>
							<H5 fontWeight="bold">Output</H5>
							<Editor mode="javascript" isReadOnly value="" height={32} />
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
