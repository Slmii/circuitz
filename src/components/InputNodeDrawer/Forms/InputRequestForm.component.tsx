import { Divider, FormHelperText, Stack, useTheme } from '@mui/material';
import { RefObject, useMemo } from 'react';
import { Form } from 'components/Form';
import { Field } from 'components/Form/Field';
import { RadioButton } from 'components/Form/RadioButton';
import { H5, B2 } from 'components/Typography';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Icon } from 'components/Icon';
import { IconButton } from 'components/IconButton';
import { v4 as uuidv4 } from 'uuid';
import { useGetNodeCanisterId } from 'lib/hooks';
import { Node } from 'lib/types';
import { NodeType, VerificationType } from 'declarations/nodes.declarations';
import { getInputCanisterFormValues } from 'lib/utils/nodes.utilts';
import { toPrincipal } from 'lib/utils/identity.utils';
import AceEditor from 'react-ace';
import { InputNodeFormValues } from '../InputNodeDrawer.types';

export const InputCanisterForm = ({
	formRef,
	node,
	onAddNode
}: {
	formRef: RefObject<HTMLFormElement>;
	node?: Node;
	onAddNode: (data: NodeType) => Promise<void>;
}) => {
	const theme = useTheme();
	const { data: nodeCanisterId } = useGetNodeCanisterId();

	const aceEditorTheme = useMemo(() => {
		return theme.palette.mode === 'dark' ? 'cloud9_night' : 'cloud9_day';
	}, [theme.palette.mode]);

	const handleOnSubmit = async (data: InputNodeFormValues) => {
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

		onAddNode({
			Canister: {
				description: data.description.length ? [data.description] : [],
				name: data.name,
				sample_data: data.sampleData.length ? [data.sampleData] : [],
				verification_type: verificationType
			}
		});
	};

	return (
		<Form<InputNodeFormValues>
			action={handleOnSubmit}
			defaultValues={getInputCanisterFormValues(node)}
			myRef={formRef}
			render={({ watch, setValue }) => (
				<>
					<Stack direction="column" spacing={2}>
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
							Verification <b>"Whitelist"</b> is recommended for Input Nodes. This will ensure that only the specified
							principals (callers) can send data to this Input Node.
						</B2>
						<RadioButton
							name="verificationType"
							options={[
								{
									id: 'none',
									label: 'None'
								},
								{
									id: 'token',
									label: 'Token'
								},
								{
									id: 'whitelist',
									label: 'Whitelist (recommended)'
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
						<Stack direction="row" alignItems="center">
							<H5 fontWeight="bold">Sample data</H5>
							<Icon
								icon="info"
								spacingLeft
								tooltip="This is the sample data that will be used in the circuit. You can manually enter sample JSON data in the field below."
							/>
						</Stack>
						<AceEditor
							mode="javascript"
							theme={aceEditorTheme}
							onChange={value => setValue('sampleData', value)}
							name="UNIQUE_ID_OF_DIV"
							editorProps={{ $blockScrolling: true }}
							defaultValue={watch('sampleData')}
							height="300px"
							width="100%"
							setOptions={{
								enableBasicAutocompletion: true,
								enableLiveAutocompletion: true,
								enableSnippets: true
							}}
						/>
					</Stack>
					<Divider />
					<Stack direction="column" spacing={2}>
						<H5 fontWeight="bold">How to send data to this Input Node?</H5>
						<B2>Rust</B2>
						<AceEditor
							mode="rust"
							theme={aceEditorTheme}
							name="UNIQUE_ID_OF_DIV"
							editorProps={{ $blockScrolling: true }}
							height="224px"
							width="100%"
							value={`use ic_cdk::api::call;

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
	"${nodeCanisterId?.toString()}".to_string(),
	"input_node",
	(serde_json::to_string($address)),
)
.await;`}
							readOnly
						/>
						<B2>Javascript</B2>
						{watch('verificationType') === 'token' && (
							<FormHelperText error>
								Be careful with using Token verification on the front-end as it can be easily compromised, unless you
								don't mind others using your Circuit.
							</FormHelperText>
						)}
						<AceEditor
							mode="javascript"
							theme={aceEditorTheme}
							name="UNIQUE_ID_OF_DIV"
							editorProps={{ $blockScrolling: true }}
							height="336px"
							width="100%"
							value={`const address = {
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
	canisterId: "${nodeCanisterId}"
});

const response = await actor.input_node(JSON.stingify(address));`}
							readOnly
						/>
					</Stack>
				</>
			)}
		/>
	);
};

const InputNodeVerficationType = () => {
	const { watch, setValue } = useFormContext<InputNodeFormValues>();
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
						endElement={
							<IconButton
								tooltip="Generate token"
								icon="refresh-outline"
								onClick={() => setValue('verificationTypeToken', uuidv4())}
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
							endElement={
								<>
									{fields.length - 1 === index && (
										<IconButton icon="add" tooltip="Add Principal" onClick={() => append({ principal: '' })} />
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
