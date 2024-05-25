import { Divider, Stack } from '@mui/material';
import { RefObject } from 'react';
import { Form } from 'components/Form';
import { Field } from 'components/Form/Field';
import { RadioButton } from 'components/Form/RadioButton';
import { H5, B2 } from 'components/Typography';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { IconButton } from 'components/IconButton';
import { v4 as uuidv4 } from 'uuid';
import { Node } from 'lib/types';
import { NodeType, VerificationType } from 'declarations/nodes.declarations';
import { toPrincipal, getInputCanisterFormValues } from 'lib/utils';
import { inputCanisterSchema } from 'lib/schemas';
import { Editor, StandaloneEditor } from 'components/Editor';
import { InputNodeFormValues } from '../NodeDrawers.types';
import { Alert } from 'components/Alert';
import { ENV } from 'lib/constants';
import { canisterId } from 'api/canisterIds';
import { useAuth } from 'lib/hooks';
import { CopyTextButton } from 'components/Button';

export const InputNodeCanisterForm = ({
	formRef,
	node,
	onProcessNode
}: {
	formRef: RefObject<HTMLFormElement>;
	node?: Node;
	onProcessNode: (data: NodeType) => Promise<void>;
}) => {
	const { user } = useAuth();

	const handleOnSubmit = (data: InputNodeFormValues) => {
		let verificationType: VerificationType = { None: null };
		if (data.verificationType === 'token') {
			verificationType = {
				Token: {
					field: data.verificationTypeTokenField,
					token: data.verificationTypeToken
				}
			};
		} else if (data.verificationType === 'whitelist') {
			verificationType = {
				Whitelist: data.verificationTypeWhitelist.map(({ principal }) => toPrincipal(principal))
			};
		}

		onProcessNode({
			Canister: {
				description: data.description.length ? [data.description] : [],
				name: data.name,
				sample_data: data.inputSampleData,
				verification_type: verificationType
			}
		});
	};

	return (
		<Form<InputNodeFormValues>
			action={handleOnSubmit}
			defaultValues={getInputCanisterFormValues(node)}
			myRef={formRef}
			schema={inputCanisterSchema}
			render={({ watch }) => (
				<>
					<Stack direction="column" spacing={2}>
						<Alert severity="info">
							An Input Node accepts data from the outside world and is the initial Node in your Circuit.
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
						<H5 fontWeight="bold">Verification</H5>
						<B2>
							It's advised to use the <b>Whitelist</b> verification for Input Nodes. This guarantees that only
							designated principals{' '}
							<CopyTextButton textToCopy={user?.user_id.toString() ?? ''}>
								(click here to copy your principal)
							</CopyTextButton>{' '}
							can transmit data to the node.
						</B2>
						<RadioButton
							name="verificationType"
							options={[
								{
									id: 'whitelist',
									label: 'Whitelist (recommended)'
								},
								{
									id: 'token',
									label: 'Token'
								},
								{
									id: 'none',
									label: 'None'
								}
							]}
						/>
						{watch('verificationType') !== 'none' && (
							<Stack direction="column" spacing={4}>
								<InputNodeVerficationType />
							</Stack>
						)}
					</Stack>
					<Divider />
					<Stack direction="column" spacing={2}>
						<H5 fontWeight="bold">Sample data</H5>
						<B2>
							Here's the sample data for the circuit. Enter your sample JSON data below. This data will serve as the
							foundation and will undergo processing by the configured nodes.
						</B2>
						<Editor name="inputSampleData" mode="javascript" />
					</Stack>
					<Divider />
					<Stack direction="column" spacing={2}>
						<H5 fontWeight="bold">How do you transmit data to this Input Node?</H5>
						<B2>Rust</B2>
						<StandaloneEditor
							id="input-node-canister-transmit-data-rust"
							height={256}
							mode="rust"
							value={`
use ic_cdk::api::call;

let address = Address {
	street: "10 Downing Street".to_owned(),
	city: "London".to_owned(),
	${
		watch('verificationType') === 'token'
			? `${watch('verificationTypeTokenField')}: "${watch('verificationTypeToken')}".to_string()`
			: ''
	}
};

let response: Result<(Result<String, Error>,), _> = call::call(
	"${canisterId[ENV]}".to_string(),
	"input_node",
	(serde_json::to_string($address)),
).await;
`}
							isReadOnly
						/>
						<B2>Javascript</B2>
						{watch('verificationType') === 'token' && (
							<Alert severity="error">
								Be careful with using Token verification on the front-end as it can be easily compromised, unless you
								don't mind others using your Circuit.
							</Alert>
						)}
						<StandaloneEditor
							id="input-node-canister-transmit-data-js"
							height={350}
							mode="javascript"
							value={`
const address = {
	street: "10 Downing Street",
	city: "London",
	${
		watch('verificationType') === 'token'
			? `${watch('verificationTypeTokenField')}: "${watch('verificationTypeToken')}"`
			: ''
	}
};

const agent = new HttpAgent({
	host: "https://icp0.io",
	identity: identity
});

const actor = Actor.createActor(idlFactory, {
	agent,
	canisterId: "${canisterId[ENV]}"
});

const response = await actor.input_node(JSON.stingify(address));
`}
							isReadOnly
						/>
					</Stack>
				</>
			)}
		/>
	);
};

const InputNodeVerficationType = () => {
	const { watch, setValue, clearErrors } = useFormContext<InputNodeFormValues>();
	const { fields, append, remove } = useFieldArray({
		name: 'verificationTypeWhitelist'
	});

	return (
		<>
			{watch('verificationType') === 'token' && (
				<>
					<Field
						name="verificationTypeTokenField"
						label="Field"
						placeholder="token"
						helperText="This is the field that will be used to verify the Input Node."
					/>
					<Field
						outsideElement={
							<IconButton
								tooltip="Generate token"
								icon="refresh-linear"
								onClick={() => {
									setValue('verificationTypeToken', uuidv4());
									clearErrors('verificationTypeToken');
								}}
							/>
						}
						name="verificationTypeToken"
						label="Token"
						placeholder="aaaaa-aaaaa-aaaaa-aaaaa"
						helperText="This is the token that will be used to verify the Input Node."
					/>
				</>
			)}
			{watch('verificationType') === 'whitelist' && (
				<>
					{fields.map((config, index) => (
						<Field
							key={config.id}
							name={`verificationTypeWhitelist.${index}.principal`}
							label="Principal"
							placeholder="aaaaa-aa"
							outsideElement={
								<>
									{fields.length - 1 === index && (
										<IconButton
											icon="add-linear"
											tooltip="Add Principal"
											onClick={() => append({ principal: '' }, { shouldFocus: false })}
										/>
									)}
									{fields.length > 1 && (
										<IconButton
											icon="close-linear"
											tooltip="Remove Principal"
											color="error"
											onClick={() => remove(index)}
										/>
									)}
								</>
							}
						/>
					))}
				</>
			)}
		</>
	);
};
