import { Alert, Divider, Stack } from '@mui/material';
import { RefObject } from 'react';
import { Form } from 'components/Form';
import { Field } from 'components/Form/Field';
import { B2, H5 } from 'components/Typography';
import { Node } from 'lib/types';
import { NodeType } from 'declarations/nodes.declarations';
import { inputCanisterSchema } from 'lib/schemas';
import { LookupCanisterFormValues } from '../NodeDrawers.types';
import { useFieldArray } from 'react-hook-form';
import { IconButton } from 'components/IconButton';
import { Principal } from '@dfinity/principal';
import { getLookupCanisterFormValues } from 'lib/utils/nodes.utilts';

export const LookupCanisterForm = ({
	formRef,
	node,
	onProcessNode
}: {
	formRef: RefObject<HTMLFormElement>;
	node?: Node;
	onProcessNode: (data: NodeType) => Promise<void>;
}) => {
	const handleOnSubmit = async (data: LookupCanisterFormValues) => {
		onProcessNode({
			LookupCanister: {
				name: data.name,
				description: data.description.length ? [data.description] : [],
				canister: Principal.fromText(data.canisterId),
				method: data.methodName,
				args: data.args.map(arg => [arg.name, arg.value])
			}
		});
	};

	return (
		<Form<LookupCanisterFormValues>
			action={handleOnSubmit}
			defaultValues={getLookupCanisterFormValues(node)}
			myRef={formRef}
			schema={inputCanisterSchema}
			render={() => (
				<>
					<Stack direction="column" spacing={2}>
						<Alert severity="info">
							A Lookup Canister Node is used to query data from an external Canister and send it to the next Node in the
							Circuit.
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
							The order of the arguments is important. The first argument will be the first argument of the method, the
							second argument will be the second argument of the method, and so on.
						</B2>
						<LookupCanisterArgs />
					</Stack>
				</>
			)}
		/>
	);
};

const LookupCanisterArgs = () => {
	const { fields, append, remove } = useFieldArray({
		name: 'args'
	});

	return (
		<>
			{fields.map((config, index) => (
				<Stack direction="row" spacing={1} key={config.id} alignItems="center">
					<Field fullWidth name={`args.${index}.name`} label="Name" placeholder="id" />
					<Field fullWidth name={`args.${index}.value`} label="Value" placeholder="5" />
					<IconButton
						sx={{
							visibility: fields.length - 1 === index ? 'visible' : 'hidden'
						}}
						icon="add"
						tooltip="Add argument"
						onClick={() => append({ principal: '' })}
					/>
					{fields.length > 1 && (
						<IconButton icon="close-linear" tooltip="Remove argument" color="error" onClick={() => remove(index)} />
					)}
				</Stack>
			))}
		</>
	);
};
