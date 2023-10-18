import { useFormSubmit } from 'lib/hooks/useFormSubmit';
import { useAddNode, useEditNode, useGetNodeCanisterId, useGetParam } from 'lib/hooks';
import { NodeType } from 'declarations/nodes.declarations';
import { LookupCanisterForm } from './Forms/LookupCanisterForm.component';
import { InputNodeDrawerProps, InputNodeFormValues, LookupCanisterFormValues } from './NodeDrawers.types';
import { Drawer } from 'components/Drawer';
import { Divider, Stack } from '@mui/material';
import { Button } from 'components/Button';
import { B2, H5 } from 'components/Typography';
import { Editor } from 'components/Editor';
import { useFormContext } from 'react-hook-form';
import { NodeSourceType } from 'lib/types';
import { useMutation } from '@tanstack/react-query';
import { api } from 'api/index';
import { toPrincipal } from 'lib/utils/identity.utils';
import { getLookupCanisterFormArgs } from 'lib/utils/nodes.utilts';

export const LookupNodeDrawer = ({ node, nodeType, open, onClose }: InputNodeDrawerProps) => {
	const circuitId = useGetParam('circuitId');
	const { formRef, submitter } = useFormSubmit();

	const { mutateAsync: addNode, isLoading: isAddNodeLoading } = useAddNode();
	const { mutateAsync: editNode, isLoading: isEditNodeLoading } = useEditNode();

	const handleOnSubmit = async (data: NodeType) => {
		if (!node) {
			await addNode({
				circuitId: Number(circuitId),
				data
			});
		} else {
			await editNode({
				nodeId: node.id,
				data
			});
		}

		onClose();
	};

	// TODO: use to seperate forms
	nodeType;

	return (
		<Drawer
			onClose={onClose}
			onSubmit={submitter}
			isOpen={open}
			isLoading={isAddNodeLoading || isEditNodeLoading}
			title="Lookup Canister"
			fullWidth
		>
			<LookupCanisterForm formRef={formRef} node={node} onProcessNode={handleOnSubmit}>
				<PreviewRequest type="LookupCanister" />
			</LookupCanisterForm>
		</Drawer>
	);
};

type FormData<T extends NodeSourceType> = T extends 'LookupCanister' ? LookupCanisterFormValues : InputNodeFormValues;
const PreviewRequest = ({ type }: { type: NodeSourceType }) => {
	const circuitId = useGetParam('circuitId');
	const nodeCanisterId = useGetNodeCanisterId(Number(circuitId));
	const { getValues, trigger } = useFormContext<FormData<typeof type>>();

	const { mutate: preview, data, error, isLoading: isPreviewLoading } = useMutation(api.Nodes.previewLookupCanister);

	return (
		<>
			<Divider orientation="vertical" flexItem />
			<Stack direction="column" spacing={2} width="50%">
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
						if (type === 'LookupCanister' && 'canisterId' in values) {
							preview({
								args: getLookupCanisterFormArgs(values.args),
								canister: toPrincipal(values.canisterId),
								description: values.description.length ? [values.description] : [],
								method: values.methodName,
								name: values.name
							});
						}
					}}
				>
					Send preview request
				</Button>
				<B2>
					Make sure to authorize Canister ID <code>{nodeCanisterId.toString()}</code> before accessing the canister you
					want to query.
				</B2>
				<Editor
					mode="javascript"
					value={`${data ? JSON.stringify(data, null, 4) : ''} ${
						error ? (typeof error === 'string' ? error : JSON.stringify((error as Error).message, null, 4)) : ''
					}`}
					isReadOnly
					height="100%"
				/>
			</Stack>
		</>
	);
};
