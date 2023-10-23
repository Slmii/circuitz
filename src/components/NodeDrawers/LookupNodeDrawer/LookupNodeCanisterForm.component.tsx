import { Alert, Divider, Stack } from '@mui/material';
import { PropsWithChildren, RefObject } from 'react';
import { Form } from 'components/Form';
import { Field } from 'components/Form/Field';
import { B2, H5 } from 'components/Typography';
import { Node } from 'lib/types';
import { NodeType } from 'declarations/nodes.declarations';
import { lookupCanisterSchema } from 'lib/schemas';
import { LookupCanisterArg, LookupCanisterFormValues } from '../NodeDrawers.types';
import { useFieldArray, useWatch } from 'react-hook-form';
import { IconButton } from 'components/IconButton';
import { Principal } from '@dfinity/principal';
import { getLookupCanisterFormValues, getLookupCanisterValuesAsArg } from 'lib/utils';
import { Button } from 'components/Button';
import { Select } from 'components/Form/Select';

export const LookupNodeCanisterForm = ({
	formRef,
	node,
	onProcessNode,
	children
}: PropsWithChildren<{
	formRef: RefObject<HTMLFormElement>;
	node?: Node;
	onProcessNode: (data: NodeType) => void;
}>) => {
	const handleOnSubmit = async (data: LookupCanisterFormValues) => {
		onProcessNode({
			LookupCanister: {
				name: data.name,
				description: data.description.length ? [data.description] : [],
				canister: Principal.fromText(data.canisterId),
				method: data.methodName,
				cycles: BigInt(data.cycles),
				args: getLookupCanisterValuesAsArg(data.args)
			}
		});
	};

	return (
		<Form<LookupCanisterFormValues>
			action={handleOnSubmit}
			defaultValues={getLookupCanisterFormValues(node)}
			myRef={formRef}
			schema={lookupCanisterSchema}
			render={() => (
				<Stack direction="row" spacing={4}>
					<Stack spacing={4} width="50%">
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
								Argument order matters. The first argument corresponds to the method's first parameter, the second to
								its second, and so forth.
							</B2>
							<LookupCanisterArgs />
						</Stack>
					</Stack>
					{children}
				</Stack>
			)}
		/>
	);
};

const LookupCanisterArgs = () => {
	const args = useWatch({
		name: 'args'
	}) as LookupCanisterArg[];
	const { fields, append, remove } = useFieldArray<LookupCanisterFormValues>({
		name: 'args'
	});

	return (
		<>
			{fields.map((config, index) => (
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
								id: 'Field',
								label: 'Field'
							},
							{
								id: 'Oject',
								label: 'Object (soon)',
								disabled: true
							},
							{
								id: 'Array',
								label: 'Array (soon)',
								disabled: true
							}
						]}
						label="Data type"
						placeholder="String"
					/>
					{args[index]?.dataType === 'Field' ? (
						// TODO: apply all logic of previous nodes with the sampleData and get the fields in the options in the Select
						<Select
							options={[
								{
									id: 'test',
									label: 'Test'
								}
							]}
							fullWidth
							name={`args.${index}.value`}
							label="Value"
						/>
					) : (
						<Field fullWidth name={`args.${index}.value`} label="Value" placeholder="5" />
					)}
					<IconButton icon="close-linear" tooltip="Remove argument" color="error" onClick={() => remove(index)} />
				</Stack>
			))}
			<Button
				startIcon="add"
				sx={{ width: 'fit-content' }}
				variant="outlined"
				size="large"
				onClick={() => append({ dataType: 'String', value: '' })}
			>
				{!fields.length ? 'Add first argument' : 'Add argument'}
			</Button>
		</>
	);
};
