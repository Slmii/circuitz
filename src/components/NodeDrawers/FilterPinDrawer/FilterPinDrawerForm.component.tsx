import { Divider, Paper, Stack } from '@mui/material';
import { StandaloneEditor, Editor } from 'components/Editor';
import { Form } from 'components/Form';
import { Field } from 'components/Form/Field';
import { Select } from 'components/Form/Select';
import { H5 } from 'components/Typography';
import { Node, PinSourceType } from 'lib/types';
import { Fragment, RefObject, useEffect, useState } from 'react';
import { FilterPinFormValues } from '../NodeDrawers.types';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { StandaloneCheckbox } from 'components/Form/Checkbox';
import { RadioButton } from 'components/Form/RadioButton';
import { Button } from 'components/Button';
import { IconButton } from 'components/IconButton';
import { Dialog } from 'components/Dialog';
import { useGetCircuitNodes, useGetParam } from 'lib/hooks';
import {
	getFilterPinValuesAsArg,
	getFilterPinFormValues,
	isFilterTrue,
	getPin,
	getNodeMetaData,
	stringifyJson
} from 'lib/utils';
import { FilterPin, Pin } from 'declarations/nodes.declarations';
import { filterPinSchema } from 'lib/schemas';
import { OVERFLOW, OVERFLOW_FIELDS, POPULATE_SAMPLE_DATA } from 'lib/constants';
import { DATA_TYPES, OPERAND_TYPES, OPERATORS } from './FilterPin.constants';
import { Alert, TipAlert } from 'components/Alert';
import { HandlebarsInfo } from 'components/Shared';
import { useParams } from 'react-router-dom';
import { getSampleData } from 'api/nodes.api';

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
	const [outputSampleData, setOutputSampleData] = useState('');

	const circuitId = useGetParam('circuitId');
	const { data: circuitNodes } = useGetCircuitNodes(Number(circuitId));

	const handleOnSubmit = (data: FilterPinFormValues) => {
		const values: FilterPin = {
			condition: data.condition === 'Is' ? { Is: null } : { Not: null },
			condition_group: data.conditionGroup ? [data.conditionGroup === 'And' ? { And: null } : { Or: null }] : [],
			rules: getFilterPinValuesAsArg(data.rules),
			sample_data: data.inputSampleData
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

	return (
		<Form<FilterPinFormValues>
			action={handleOnSubmit}
			defaultValues={() => {
				const filterPin = getPin<FilterPin>(node, filterType);
				const formValues = getFilterPinFormValues(filterPin);
				let inputSampleData = formValues.inputSampleData;

				if (!inputSampleData.length) {
					if (filterType === 'LookupFilterPin' && node) {
						const metadata = getNodeMetaData(node);
						inputSampleData = metadata.inputSampleData;
					} else {
						const nodes = circuitNodes ?? [];
						const currentNodeIndex = nodes.findIndex(({ id }) => id === node.id);

						if (currentNodeIndex !== -1) {
							const previousNode = nodes[currentNodeIndex - 1];
							if (previousNode) {
								const metadata = getNodeMetaData(previousNode);
								inputSampleData = metadata.inputSampleData;
							}
						}
					}
				}

				return {
					...formValues,
					inputSampleData
				};
			}}
			schema={filterPinSchema}
			myRef={formRef}
			render={({ getValues }) => (
				<Stack direction="row" spacing={4} sx={OVERFLOW_FIELDS}>
					<FormValuesUpdater />
					<Stack direction="column" spacing={2} width="50%" sx={{ ...OVERFLOW, pr: 1 }}>
						<Alert severity="info">
							{filterType === 'FilterPin'
								? "A Filter Pin filters the node according to the specified rules below. If these rules are met, the node's execution can be triggered."
								: 'A Lookup Filter Pin filters the node according to the specified rules below. If these rules are met, the Lookup values will be merged into the next Node or Pin.'}
						</Alert>
						<H5 fontWeight="bold">Rules</H5>
						<Rules />
					</Stack>
					<Divider orientation="vertical" flexItem />
					<Stack direction="column" spacing={4} width="50%" height="100%">
						<Stack direction="column" spacing={2}>
							<H5 fontWeight="bold">Input</H5>
							<Button
								fullWidth
								variant="contained"
								size="large"
								startIcon="filter-linear"
								disabled={!getValues().inputSampleData}
								onClick={() => handleOnPreview(getValues())}
							>
								Preview
							</Button>
							<TipAlert>{POPULATE_SAMPLE_DATA}</TipAlert>
							<Editor name="inputSampleData" mode="javascript" height={450} />
						</Stack>
						<Stack direction="column" spacing={2}>
							<H5 fontWeight="bold">Output</H5>
							<StandaloneEditor
								id="filter-pin-output-sample-data"
								mode="javascript"
								isReadOnly
								value={outputSampleData}
								height={32}
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
	const { setValue } = useFormContext<FilterPinFormValues>();

	useEffect(() => {
		if (!circuitNodes || !nodeId || !pinType) {
			return;
		}

		const init = async () => {
			// Get previous nodes before the current node
			// In case of LookupFilterPin, we need to include the current node
			const index = circuitNodes.findIndex(({ id }) => id === Number(nodeId));
			const previousNodes = circuitNodes.slice(0, pinType === 'FilterPin' ? index : index + 1);

			const collectedSampleData = await getSampleData(previousNodes, {
				skipNodes: ['LookupCanister', 'LookupHttpRequest'],
				includePostMapper: pinType === 'FilterPin'
			});

			setValue('inputSampleData', stringifyJson(collectedSampleData));
		};

		init();
	}, [circuitNodes, pinType, nodeId, setValue]);

	return null;
};

const Rules = () => {
	const [fieldSettingsIndex, setFieldSettingsIndex] = useState<number | null>(null);
	const [isFieldHover, setIsFieldHover] = useState<Record<number, boolean>>({});

	const { fields, append, remove } = useFieldArray({ name: 'rules' });
	const { watch, setValue } = useFormContext<FilterPinFormValues>();

	useEffect(() => {
		if (fields.length > 1) {
			setValue('conditionGroup', 'And');
		} else if (fields.length === 1) {
			setValue('conditionGroup', null);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fields.length]);

	return (
		<Paper sx={{ p: 2 }}>
			<Stack spacing={1}>
				<Stack direction="row" columnGap={2} width="100%" alignItems="flex-start">
					<StandaloneCheckbox
						name="condition"
						label="Not"
						checked={watch('condition') === 'Not'}
						onChange={checked => setValue('condition', checked ? 'Not' : 'Is')}
					/>
					<RadioButton
						disabled={fields.length === 1}
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
							append(
								{
									field: '',
									operator: '',
									value: '',
									dataType: 'String',
									operandType: 'Value'
								},
								{ shouldFocus: false }
							)
						}
					>
						Add rule
					</Button>
				</Stack>
				<Stack spacing={2}>
					{fields.map((field, index) => (
						<Fragment key={field.id}>
							<Stack
								spacing={1}
								onMouseEnter={() => setIsFieldHover({ ...isFieldHover, [index]: true })}
								onMouseLeave={() => setIsFieldHover({ ...isFieldHover, [index]: false })}
							>
								<Field fullWidth name={`rules.${index}.field`} label="Field" helperText={<HandlebarsInfo />} />
								<Select fullWidth name={`rules.${index}.operator`} label="Operator" options={OPERATORS} />
								<Field
									fullWidth
									name={`rules.${index}.value`}
									label="Value"
									outsideElement={
										<IconButton
											disabled={!isFieldHover[index]}
											icon="settings"
											onClick={() => setFieldSettingsIndex(index)}
										/>
									}
								/>
								<Button disabled={fields.length === 1} color="error" onClick={() => remove(index)}>
									Remove rule
								</Button>
							</Stack>
							{index !== fields.length - 1 && <Divider />}
						</Fragment>
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
						helperText={
							<>
								Operand type 'Field' will allow you to compare the field with another field. <HandlebarsInfo />.
							</>
						}
						fullWidth
						name={`rules.${fieldSettingsIndex}.operandType`}
						label="Operand type"
						options={OPERAND_TYPES}
					/>
					<Select
						helperText="Data type will allow you to specify the type of the value."
						fullWidth
						name={`rules.${fieldSettingsIndex}.dataType`}
						label="Data type"
						options={DATA_TYPES}
					/>
				</Stack>
			</Dialog>
		</Paper>
	);
};
