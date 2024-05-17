import { Box, Divider, Paper, Stack } from '@mui/material';
import { RefObject, useEffect, useState } from 'react';
import { Form } from 'components/Form';
import { Field } from 'components/Form/Field';
import { B2, H5 } from 'components/Typography';
import { Node, NodeSourceType } from 'lib/types';
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
	getPlaceholderNode,
	isHandlebarsTemplate,
	parseIDL,
	parseJson,
	stringifyJson,
	toPrincipal
} from 'lib/utils';
import { Button, CopyTextButton } from 'components/Button';
import { Select } from 'components/Form/Select';
import { DATA_TYPES, ENV, OVERFLOW, OVERFLOW_FIELDS, POPULATE_SAMPLE_DATA, QUERY_KEYS } from 'lib/constants';
import { Alert, TipAlert } from 'components/Alert';
import { Editor, StandaloneEditor } from 'components/Editor';
import { canisterId } from 'api/canisterIds';
import { useGetCircuitNodes, useLookupCanisterPreview, useLookupNodePreview } from 'lib/hooks';
import { HandlebarsInfo } from 'components/Shared';
import { api } from 'api/index';
import { useQuery } from '@tanstack/react-query';
import { CircularProgress } from 'components/Progress';
import { SelectAutocomplete, Option } from 'components/Form/SelectAutocomplete';
import { StandaloneCheckbox } from 'components/Form/Checkbox';
import { useParams } from 'react-router-dom';
import { getSampleData } from 'api/nodes.api';

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
				sample_data: data.inputSampleData
			}
		});
	};

	return (
		<Form<LookupCanisterFormValues>
			action={handleOnSubmit}
			defaultValues={() => getLookupCanisterFormValues(node)}
			myRef={formRef}
			schema={lookupCanisterSchema}
		>
			<Stack direction="row" spacing={4} sx={OVERFLOW_FIELDS}>
				<FormValuesUpdater />
				<Stack spacing={4} width="50%" sx={{ ...OVERFLOW, pr: 1 }}>
					<Stack direction="column" spacing={2}>
						<Alert severity="info">
							A Lookup Canister Node queries data from an external Canister and forwards it to the subsequent Node in
							the Circuit.
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
							<CanisterMethod />
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
					<Preview />
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

const FormValuesUpdater = () => {
	const { circuitId, nodeId, nodeType } = useParams<{
		circuitId: string;
		nodeId: string;
		nodeType: NodeSourceType;
	}>();

	const { data: circuitNodes } = useGetCircuitNodes(Number(circuitId));
	const { setValue } = useFormContext<LookupCanisterFormValues>();

	useEffect(() => {
		if (!circuitNodes || !nodeType) {
			return;
		}

		const init = async () => {
			// In case of a new node
			// 1. set index to the length of current nodes + 1
			// 2. add a placeholder node and populate the sample data

			// In case of an existing node
			// 1. set index to the index of the node in the array
			// 2. get all the nodes before and including the current node

			const index = nodeId ? circuitNodes.findIndex(({ id }) => id === Number(nodeId)) : circuitNodes.length + 1;
			const previousNodes: Node[] = nodeId
				? circuitNodes.slice(0, index + 1)
				: [
						...circuitNodes,
						{ ...getPlaceholderNode({ circuitId: Number(circuitId), nodeId: index, nodeType: 'LookupCanister' }) }
				  ];

			const collectedSampleData = await getSampleData(previousNodes, {
				skipNodes: ['LookupCanister', 'LookupHttpRequest'],
				includePostMapper: false
			});

			setValue('inputSampleData', stringifyJson(collectedSampleData));
		};

		init();
	}, [circuitNodes, nodeId, setValue, nodeType, circuitId]);

	return null;
};

const Preview = () => {
	const { getValues, trigger } = useFormContext<LookupCanisterFormValues>();
	const { mutate: preview, data, error, isPending: isPreviewPending } = useLookupCanisterPreview();
	useLookupNodePreview({ nodeType: 'LookupCanister', data, error });

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

const CanisterMethod = () => {
	const [canShowArgs, setCanShowArgs] = useState(false);
	const { watch, setValue, clearErrors } = useFormContext<LookupCanisterFormValues>();
	const [canisterId, methodName] = watch(['canisterId', 'methodName']);

	const { data, isLoading, refetch, isRefetching } = useQuery({
		queryKey: [QUERY_KEYS.CANDID, canisterId],
		enabled: false,
		queryFn: async ({ queryKey }) => {
			const did = await api.IC.didToJs(queryKey[1]);
			return parseIDL(did);
		}
	});

	useEffect(() => {
		try {
			Principal.fromText(canisterId);
			refetch();
		} catch (error) {
			setValue('methodName', '');
		}
	}, [canisterId, clearErrors, refetch, setValue]);

	const options: Option[] = (data ?? []).map(func => ({ id: func.name, label: func.name }));
	const method = (data ?? [])?.find(func => func.name === methodName);

	return (
		<Stack>
			<SelectAutocomplete
				options={options}
				name="methodName"
				label="Method name"
				placeholder="get_name"
				disabled={isLoading || isRefetching}
				endElement={
					isLoading || isRefetching ? (
						<CircularProgress />
					) : (
						<IconButton icon="refresh-linear" size="small" onClick={() => refetch()} tooltip="Refresh" />
					)
				}
			/>
			<StandaloneCheckbox
				checked={canShowArgs}
				label="Show arguments preview"
				name="argumentsPreview"
				onChange={setCanShowArgs}
			/>
			{canShowArgs && method ? (
				<StandaloneEditor
					isReadOnly
					id="methodDescription"
					mode="json"
					value={stringifyJson(method)}
					height={150}
					options={{ wrap: false }}
				/>
			) : undefined}
		</Stack>
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
