import { Divider, Stack } from '@mui/material';
import { RefObject, useEffect } from 'react';
import { Form } from 'components/Form';
import { Field } from 'components/Form/Field';
import { B2, H5 } from 'components/Typography';
import { Node } from 'lib/types';
import { NodeType } from 'declarations/nodes.declarations';
import { lookupCanisterSchema } from 'lib/schemas';
import { LookupCanisterArg, LookupCanisterFormValues } from '../NodeDrawers.types';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { IconButton } from 'components/IconButton';
import { Principal } from '@dfinity/principal';
import { getLookupCanisterFormValues, getLookupCanisterValuesAsArg, stringifyJson, toPrincipal } from 'lib/utils';
import { Button, CopyTextButton } from 'components/Button';
import { Select } from 'components/Form/Select';
import { ENV, OVERFLOW, OVERFLOW_FIELDS } from 'lib/constants';
import { Alert, TipAlert } from 'components/Alert';
import { Icon } from 'components/Icon';
import { Editor } from 'components/Editor';
import { canisterId } from 'api/canisterIds';
import { usePreview } from 'lib/hooks';
import createMapper from 'map-factory';

export const LookupNodeCanisterForm = ({
	formRef,
	node,
	onProcessNode
}: {
	formRef: RefObject<HTMLFormElement>;
	node?: Node;
	onProcessNode: (data: NodeType) => void;
}) => {
	const handleOnSubmit = (data: LookupCanisterFormValues) => {
		onProcessNode({
			LookupCanister: {
				name: data.name,
				description: data.description.length ? [data.description] : [],
				canister: Principal.fromText(data.canisterId),
				method: data.methodName,
				cycles: BigInt(data.cycles),
				args: getLookupCanisterValuesAsArg(data.args),
				sample_data: data.inputSampleData.length ? [data.inputSampleData] : []
			}
		});
	};

	return (
		<Form<LookupCanisterFormValues>
			action={handleOnSubmit}
			defaultValues={getLookupCanisterFormValues(node)}
			myRef={formRef}
			schema={lookupCanisterSchema}
		>
			<Stack direction="row" spacing={4} sx={OVERFLOW_FIELDS}>
				<Stack spacing={4} width="50%" sx={OVERFLOW}>
					<Stack direction="column" spacing={2}>
						<Alert severity="info">
							A Lookup Canister Node queries data from an external Canister and forwards it to the subsequent Node in
							the Circuit
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
						<H5 fontWeight="bold">Canister</H5>
						<Stack direction="column" spacing={4}>
							<Field name="canisterId" label="Canister ID" placeholder="Enter Canister ID" />
							<Field name="methodName" label="Method name" placeholder="Enter a method name" />
							<Field
								name="cycles"
								type="number"
								label="Cycles (T)"
								placeholder="10_000_000_000"
								helperText="To determine the required cycles, use the Preview request feature. The cycle count varies based on the number of arguments."
							/>
						</Stack>
					</Stack>
					<Divider />
					<Stack direction="column" spacing={2}>
						<H5 fontWeight="bold">Arguments</H5>
						<B2>
							Argument order matters. The first argument corresponds to the method's first parameter, the second to its
							second, and so forth.
						</B2>
						<LookupCanisterArgs />
					</Stack>
				</Stack>
				<Divider orientation="vertical" flexItem />
				<Stack direction="column" spacing={2} width="50%">
					<Preview />
					<B2>
						Before querying the desired canister, ensure Canister ID{' '}
						<CopyTextButton textToCopy={canisterId[ENV]}>{canisterId[ENV]}</CopyTextButton> is authorized.
					</B2>
					<TipAlert>You can also populate the sample data yourself to save Cycles.</TipAlert>
					<Editor name="inputSampleData" mode="javascript" height="50%" />
					<PreviewCall />
				</Stack>
			</Stack>
		</Form>
	);
};

const LookupCanisterArgs = () => {
	const {
		fields: formFields,
		append,
		remove
	} = useFieldArray<LookupCanisterFormValues>({
		name: 'args'
	});

	return (
		<>
			{formFields.map((config, index) => (
				<Stack direction="row" spacing={1} key={config.id} alignItems="center">
					<Select
						fullWidth
						name={`args.${index}.dataType`}
						options={[
							{
								id: 'String',
								label: 'String'
							},
							{
								id: 'Number',
								label: 'Number'
							},
							{
								id: 'BigInt',
								label: 'BigInt'
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
								id: 'Array',
								label: 'Array'
							},
							{
								id: 'Object',
								label: 'Object'
							}
						]}
						label="Data type"
						placeholder="String"
					/>
					<Field
						fullWidth
						name={`args.${index}.value`}
						label="Value"
						placeholder="5"
						endElement={<Icon tooltip="You can also provide a path to a field in the preview data" icon="question" />}
					/>
					<IconButton icon="close-linear" tooltip="Remove argument" color="error" onClick={() => remove(index)} />
				</Stack>
			))}
			<Button
				startIcon="add-linear"
				sx={{ width: 'fit-content' }}
				variant="outlined"
				size="large"
				onClick={() => append({ dataType: 'String', value: '' })}
			>
				{!formFields.length ? 'Add first argument' : 'Add argument'}
			</Button>
		</>
	);
};

const Preview = () => {
	const { getValues, setValue, trigger } = useFormContext<LookupCanisterFormValues>();
	const { mutate: preview, data, error, isLoading: isPreviewLoading } = usePreview();

	useEffect(() => {
		if (!data) {
			return;
		}

		if (error) {
			setValue('inputSampleData', stringifyJson(error));
			return;
		}

		if ('Ok' in data) {
			setValue('inputSampleData', stringifyJson(JSON.parse(data.Ok)));
			return;
		}

		setValue('inputSampleData', stringifyJson(data));
	}, [data, error, setValue]);

	return (
		<>
			<H5 fontWeight="bold">Preview data</H5>
			<Button
				variant="contained"
				loading={isPreviewLoading}
				size="large"
				startIcon="infinite"
				onClick={async () => {
					const isValid = await trigger();
					if (!isValid) {
						return;
					}

					const values = getValues();
					preview({
						args: getLookupCanisterValuesAsArg(values.args),
						canister: toPrincipal(values.canisterId),
						description: values.description.length ? [values.description] : [],
						method: values.methodName,
						name: values.name,
						cycles: BigInt(values.cycles),
						sample_data: values.inputSampleData.length ? [values.inputSampleData] : []
					});
				}}
			>
				Send preview request
			</Button>
		</>
	);
};

const PreviewCall = () => {
	const { watch } = useFormContext<LookupCanisterFormValues>();

	return (
		<pre>{`
const canister = ic("${watch('canisterId')}");
const response = await canister.call("${watch('methodName')}", ${watch('args')
			.map(arg => {
				const returnAsType = (arg: LookupCanisterArg, value: unknown) => {
					if (arg.dataType === 'String' || arg.dataType === 'Principal') {
						return `"${value}"`;
					}

					if (arg.dataType === 'BigInt') {
						return `${value}n`;
					}

					if (arg.dataType === 'Array' || arg.dataType === 'Object') {
						return JSON.stringify(value);
					}

					return value;
				};

				// Check if arg.value is between curly braces
				if (arg.value.startsWith('{{') && arg.value.endsWith('}}')) {
					// Get the value between the curly braces
					const key = arg.value.slice(2, -2);

					const mapper = createMapper();
					mapper.map(key).to('value');

					try {
						const output = mapper.execute(JSON.parse(watch('inputSampleData')));
						return returnAsType(arg, output.value);
					} catch (error) {
						return '';
					}
				}

				return returnAsType(arg, arg.value);
			})
			.join(', ')});
						`}</pre>
	);
};
