import { Alert, Divider, Stack } from '@mui/material';
import { PropsWithChildren, RefObject } from 'react';
import { Form } from 'components/Form';
import { Field } from 'components/Form/Field';
import { B2, H5 } from 'components/Typography';
import { Node } from 'lib/types';
import { Arg, NodeType } from 'declarations/nodes.declarations';
import { lookupCanisterSchema } from 'lib/schemas';
import { LookupCanisterArg, LookupCanisterFormValues } from '../NodeDrawers.types';
import { useFieldArray, useWatch } from 'react-hook-form';
import { IconButton } from 'components/IconButton';
import { Principal } from '@dfinity/principal';
import { getLookupCanisterFormValues } from 'lib/utils/nodes.utilts';
import { Button } from 'components/Button';
import { Select } from 'components/Form/Select';

export const LookupCanisterForm = ({
	formRef,
	node,
	onProcessNode,
	children
}: PropsWithChildren<{
	formRef: RefObject<HTMLFormElement>;
	node?: Node;
	onProcessNode: (data: NodeType) => Promise<void>;
}>) => {
	const handleOnSubmit = async (data: LookupCanisterFormValues) => {
		onProcessNode({
			LookupCanister: {
				name: data.name,
				description: data.description.length ? [data.description] : [],
				canister: Principal.fromText(data.canisterId),
				method: data.methodName,
				args: data.args.map((arg): Arg => {
					if (arg.dataType === 'String') {
						return {
							String: arg.value
						};
					}

					if (arg.dataType === 'Number') {
						return {
							Number: Number(arg.value)
						};
					}

					return {
						Boolean: arg.value === 'true'
					};
				})
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
								A Lookup Canister Node is used to query data from an external Canister and send it to the next Node in
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
								<Field name="canisterId" label="Canister ID" placeholder="Enter Canister ID" />
								<Field name="methodName" label="Method name" placeholder="Enter a method name" />
							</Stack>
						</Stack>
						<Divider />
						<Stack direction="column" spacing={2}>
							<H5 fontWeight="bold">Arguments</H5>
							<B2>
								The order of the arguments is important. The first argument will be the first argument of the method,
								the second argument will be the second argument of the method, and so on.
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
			{!fields.length ? (
				<Button
					startIcon="add"
					sx={{ width: 'fit-content' }}
					variant="outlined"
					size="large"
					onClick={() => append({ dataType: 'String', value: '' })}
				>
					Add first argument
				</Button>
			) : (
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
							<IconButton
								sx={{
									visibility: fields.length - 1 === index ? 'visible' : 'hidden'
								}}
								icon="add"
								tooltip="Add argument"
								onClick={() => append({ dataType: 'String', value: '' })}
							/>
							<IconButton icon="close-linear" tooltip="Remove argument" color="error" onClick={() => remove(index)} />
						</Stack>
					))}
				</>
			)}
		</>
	);
};
