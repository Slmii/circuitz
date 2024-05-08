import { Box, Divider, Paper, Stack } from '@mui/material';
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
import {
	getHandlebars,
	getLookupCanisterFormValues,
	getLookupCanisterValuesAsArg,
	getLookupCanisterValuesAsPreviewArg,
	getNodeMetaData,
	isHandlebarsTemplate,
	parseJson,
	stringifyJson,
	toPrincipal
} from 'lib/utils';
import { Button, CopyTextButton } from 'components/Button';
import { Select } from 'components/Form/Select';
import { DATA_TYPES, ENV, OVERFLOW, OVERFLOW_FIELDS, POPULATE_SAMPLE_DATA } from 'lib/constants';
import { Alert, TipAlert } from 'components/Alert';
import { Editor } from 'components/Editor';
import { canisterId } from 'api/canisterIds';
import { useGetCircuitNodes, useGetParam, useLookupCanisterPreview } from 'lib/hooks';
import { HandlebarsInfo } from 'components/Shared';

export const LookupNodeCanisterForm = ({
	formRef,
	node,
	onProcessNode
}: {
	formRef: RefObject<HTMLFormElement>;
	node?: Node;
	onProcessNode: (data: NodeType) => void;
}) => {
	const circuitId = useGetParam('circuitId');
	const { data: circuitNodes } = useGetCircuitNodes(Number(circuitId));

	const handleOnSubmit = (data: LookupCanisterFormValues) => {
		onProcessNode({
			LookupCanister: {
				name: data.name,
				description: data.description.length ? [data.description] : [],
				canister: Principal.fromText(data.canisterId),
				method: data.methodName,
				cycles: BigInt(data.cycles),
				args: getLookupCanisterValuesAsArg(data.args),
				sample_data: data.inputSampleData
			}
		});
	};

	return (
		<Form<LookupCanisterFormValues>
			action={handleOnSubmit}
			defaultValues={() => {
				const formValues = getLookupCanisterFormValues(node);
				let inputSampleData = formValues.inputSampleData;

				if (!inputSampleData.length) {
					const nodes = circuitNodes ?? [];
					const currentNodeIndex = nodes.findIndex(({ id }) => id === node?.id);

					if (currentNodeIndex !== -1) {
						const previousNode = nodes[currentNodeIndex - 1];
						if (previousNode) {
							const metadata = getNodeMetaData(previousNode);
							inputSampleData = metadata.inputSampleData;
						}
					}
				}

				return {
					...formValues,
					inputSampleData
				};
			}}
			myRef={formRef}
			schema={lookupCanisterSchema}
		>
			<Stack direction="row" spacing={4} sx={OVERFLOW_FIELDS}>
				<Stack spacing={4} width="50%" sx={{ ...OVERFLOW, pr: 1 }}>
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
							<Field name="canisterId" label="Canister ID" placeholder="aaaaa-aa" />
							<Field name="methodName" label="Method name" placeholder="get_name" />
							<Field
								name="cycles"
								type="number"
								label="Cycles (T)"
								placeholder="10_000_000_000"
								helperText="To determine the required cycles, use the Preview request feature. The cycles count varies based on the number of arguments."
							/>
						</Stack>
					</Stack>
					<Divider />
					<Stack direction="column" spacing={2}>
						<H5 fontWeight="bold">Arguments</H5>
						<B2>
							Argument order matters. The first argument corresponds to the method's first parameter, the second to its
							second, and so forth. <HandlebarsInfo />.
						</B2>
						<LookupCanisterArgs />
					</Stack>
				</Stack>
				<Divider orientation="vertical" flexItem />
				<Stack direction="column" spacing={2} width="50%">
					<Preview nodesLength={circuitNodes?.length ?? 0} />
					<B2>
						Before querying the desired canister, ensure Canister ID{' '}
						<CopyTextButton textToCopy={canisterId[ENV]}>{canisterId[ENV]}</CopyTextButton> is authorized.
					</B2>
					<TipAlert>{POPULATE_SAMPLE_DATA}</TipAlert>
					<Editor name="inputSampleData" mode="javascript" height="50%" />
					<PreviewCall />
				</Stack>
			</Stack>
		</Form>
	);
};

const LookupCanisterArgs = () => {
	const { fields, append, remove } = useFieldArray<LookupCanisterFormValues>({
		name: 'args'
	});

	return (
		<Paper sx={{ p: 2 }}>
			<Stack direction="column" spacing={2}>
				{fields.map((config, index) => (
					<Stack direction="row" spacing={1} key={config.id} alignItems="center">
						<Select
							fullWidth
							name={`args.${index}.dataType`}
							options={DATA_TYPES.map(dataType => ({ id: dataType, label: dataType }))}
							label="Data type"
							placeholder="String"
						/>
						<Field fullWidth name={`args.${index}.value`} label="Value" placeholder="5" />
						<IconButton icon="close-linear" tooltip="Remove argument" color="error" onClick={() => remove(index)} />
					</Stack>
				))}
				<Button
					startIcon="add-linear"
					sx={{ width: 'fit-content' }}
					variant="outlined"
					size="large"
					onClick={() => append({ dataType: 'String', value: '' }, { shouldFocus: false })}
				>
					{!fields.length ? 'Add first argument' : 'Add argument'}
				</Button>
			</Stack>
		</Paper>
	);
};

const Preview = ({ nodesLength }: { nodesLength: number }) => {
	const { getValues, setValue, trigger } = useFormContext<LookupCanisterFormValues>();
	const { mutate: preview, data, error, isPending: isPreviewPending } = useLookupCanisterPreview();

	useEffect(() => {
		if (!data) {
			return;
		}

		const key = `Node:${nodesLength}`;
		const inputSampleData = parseJson(getValues('inputSampleData'));

		if (error) {
			setValue('inputSampleData', stringifyJson({ ...inputSampleData, [key]: error }));
			return;
		}

		if ('Ok' in data) {
			setValue('inputSampleData', stringifyJson({ ...inputSampleData, [key]: JSON.parse(data.Ok) }));
			return;
		}

		setValue('inputSampleData', stringifyJson({ ...inputSampleData, [key]: data }));
	}, [data, error, getValues, nodesLength, setValue]);

	return (
		<>
			<H5 fontWeight="bold">Preview data</H5>
			<Button
				variant="contained"
				loading={isPreviewPending}
				size="large"
				startIcon="infinite"
				onClick={async () => {
					const isValid = await trigger(['args', 'canisterId', 'methodName', 'cycles']);
					if (!isValid) {
						return;
					}

					const values = getValues();

					preview({
						args: getLookupCanisterValuesAsPreviewArg(values.args),
						canister: toPrincipal(values.canisterId),
						method: values.methodName,
						cycles: BigInt(values.cycles)
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
	const args = watch('args');

	return (
		<Box
			component="pre"
			sx={{
				overflowX: 'auto',
				whiteSpace: 'pre-wrap'
			}}
		>{`
const canister = ic("${watch('canisterId')}");
const response = await canister.call("${watch('methodName')}"${
			args.length
				? `, ${args
						.map(arg => {
							const returnAsType = (arg: LookupCanisterArg, value: unknown) => {
								if (arg.dataType === 'String' || arg.dataType === 'Principal') {
									return `"${value}"`;
								}

								if (arg.dataType === 'BigInt') {
									return `${value}n`;
								}

								return value;
							};

							if (isHandlebarsTemplate(arg.value)) {
								const result = getHandlebars(arg.value, parseJson(watch('inputSampleData')));
								return returnAsType(arg, result);
							}

							return returnAsType(arg, arg.value);
						})
						.join(', ')}`
				: ''
		});
						`}</Box>
	);
};
