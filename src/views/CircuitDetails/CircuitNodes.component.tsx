import { Stack, ButtonBase, Drawer, Box, Divider, useTheme } from '@mui/material';
import { Form } from 'components/Form';
import { Field } from 'components/Form/Field';
import { RadioButton } from 'components/Form/RadioButton';
import { Icon } from 'components/Icon';
import { IconButton } from 'components/IconButton';
import { B1, Caption, H3, H5 } from 'components/Typography';
import { useMemo, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-rust';
import 'ace-builds/src-noconflict/theme-cloud9_night';
import 'ace-builds/src-noconflict/theme-cloud9_day';
import 'ace-builds/src-noconflict/ext-language_tools';
import { Button } from 'components/Button';
import { useDialogFormSubmit } from 'lib/hooks/useDialogFormSubmit';
import { Principal } from '@dfinity/principal';

interface DialogState {
	open: boolean;
	type: 'input' | 'output';
}

interface InputNodeFormValues {
	name: string;
	description: string;
	verificationType: 'token' | 'whitelist' | 'none';
	verificationTypeToken: string;
	verificationTypeTokenField: string;
	verificationTypeWhitelist: { principal: string }[];
	sampleData: string;
}

export const CircuitNodes = ({ nodeCanisterId }: { nodeCanisterId: Principal }) => {
	const [isDialogOpen, setIsDialogOpen] = useState<DialogState>({ open: false, type: 'input' });

	return (
		<>
			<Stack
				direction="row"
				alignItems="center"
				justifyContent="flex-start"
				component={ButtonBase}
				onClick={() => setIsDialogOpen({ open: true, type: 'input' })}
				sx={{ p: 2, width: 600, backgroundColor: 'background.default', borderRadius: 1 }}
			>
				<Icon icon="add-square" spacingRight fontSize="small" />
				<B1>Add Input Node</B1>
			</Stack>
			<InputNodeDialog
				open={isDialogOpen.open}
				nodeCanisterId={nodeCanisterId}
				onClose={() => setIsDialogOpen({ open: false, type: 'input' })}
			/>
		</>
	);
};

const InputNodeDialog = ({
	open,
	nodeCanisterId,
	onClose
}: {
	open: boolean;
	nodeCanisterId: Principal;
	onClose: () => void;
}) => {
	const theme = useTheme();
	const { formRef, handleSubmit } = useDialogFormSubmit();

	const aceEditorTheme = useMemo(() => {
		return theme.palette.mode === 'dark' ? 'cloud9_night' : 'cloud9_day';
	}, [theme.palette.mode]);

	return (
		<Drawer anchor="right" open={open} onClose={onClose}>
			<Stack
				direction="row"
				justifyContent="space-between"
				sx={{
					p: 4,
					backgroundColor: 'background.default',
					width: '100%',
					borderBottom: theme => `1px solid ${theme.palette.divider}`
				}}
			>
				<Stack direction="row" alignItems="center" spacing={2}>
					<H3>Input Node</H3>
					<Divider flexItem orientation="vertical" />
					<img src="/public/logos/icp.png" style={{ width: 24, height: 24 }} />
				</Stack>
				<IconButton tooltip="Close" icon="close" onClick={onClose} />
			</Stack>
			<Box sx={{ p: 4, width: 700, height: '100%', overflowY: 'auto' }}>
				<Form<InputNodeFormValues>
					action={data => console.log(data)}
					defaultValues={{
						name: '',
						description: '',
						verificationType: 'none',
						verificationTypeToken: '',
						verificationTypeTokenField: '',
						verificationTypeWhitelist: [{ principal: '' }],
						sampleData: ''
					}}
					myRef={formRef}
					render={({ watch, setValue }) => (
						<>
							<Stack direction="column" spacing={2}>
								<H5 fontWeight="bold">General</H5>
								<Stack direction="column" spacing={4}>
									<Field name="name" label="Name" placeholder="Enter a name" />
									<Field
										name="description"
										label="Description"
										multiline
										multilineRows={5}
										placeholder="Enter a description"
									/>
								</Stack>
							</Stack>
							<Divider />
							<Stack direction="column" spacing={2}>
								<H5 fontWeight="bold">Verification</H5>
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
											label: 'Whitelist'
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
								<Caption>Rust</Caption>
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
	"${nodeCanisterId}".to_string(),
	"input_node",
	(serde_json::to_string($address)),
)
.await;`}
									readOnly
								/>
								<Caption>Javascript</Caption>
								<AceEditor
									mode="javascript"
									theme={aceEditorTheme}
									name="UNIQUE_ID_OF_DIV"
									editorProps={{ $blockScrolling: true }}
									height="272px"
									width="100%"
									value={`const address = {
	street: "10 Downing Street",
	city: "London",
	${
		watch('verificationType') === 'token'
			? `
	// Be careful with using Token verification on the front-end 
	// as it can be easily compromised, unless you don't mind others 
	// using your Circuit.
	${watch('verificationTypeTokenField')}: "${watch('verificationTypeToken')}"`
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
			</Box>
			<Stack
				direction="row"
				justifyContent="flex-end"
				spacing={2}
				sx={{
					p: 4,
					backgroundColor: 'background.default',
					width: '100%',
					borderTop: theme => `1px solid ${theme.palette.divider}`
				}}
			>
				<Button onClick={handleSubmit} variant="contained">
					Save
				</Button>
				<Button variant="outlined" onClick={onClose}>
					Cancel
				</Button>
			</Stack>
		</Drawer>
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
