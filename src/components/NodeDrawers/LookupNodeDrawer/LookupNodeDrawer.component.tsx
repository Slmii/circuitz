import { useFormSubmit } from 'lib/hooks/useFormSubmit';
import { useAddNode, useEditNode, useGetNodeCanisterId, useGetParam, usePreview } from 'lib/hooks';
import { NodeType } from 'declarations/nodes.declarations';
import { LookupNodeCanisterForm } from './LookupNodeCanisterForm.component';
import { InputNodeDrawerProps, InputNodeFormValues, LookupCanisterFormValues } from '../NodeDrawers.types';
import { Drawer } from 'components/Drawer';
import { Alert, Divider, Stack } from '@mui/material';
import { Button, CopyTextButton } from 'components/Button';
import { B2, H5 } from 'components/Typography';
import { StandaloneEditor } from 'components/Editor';
import { useFormContext } from 'react-hook-form';
import { NodeSourceType } from 'lib/types';
import { toPrincipal, getLookupCanisterValuesAsArg } from 'lib/utils';
import { Dialog } from 'components/Dialog';
import { useMemo, useState } from 'react';

export const LookupNodeDrawer = ({ node, nodeType, open, onClose }: InputNodeDrawerProps) => {
	const [formData, setFormData] = useState<NodeType | null>(null);
	const [previewError, setPreviewError] = useState<string | null>(null);
	const circuitId = useGetParam('circuitId');
	const { formRef, submitter } = useFormSubmit();

	const { mutateAsync: addNode, isLoading: isAddNodeLoading } = useAddNode();
	const { mutateAsync: editNode, isLoading: isEditNodeLoading } = useEditNode();

	const handleOnConfirmCycles = async () => {
		if (!formData) {
			return formData;
		}

		// Close dialog
		setFormData(null);

		// Add call
		if (!node) {
			await addNode({
				circuitId: Number(circuitId),
				data: formData
			});
		} else {
			// Edit call
			await editNode({
				nodeId: node.id,
				data: formData
			});
		}

		onClose();
	};

	return (
		<>
			<Drawer
				onClose={onClose}
				onSubmit={submitter}
				isOpen={open}
				isLoading={isAddNodeLoading || isEditNodeLoading}
				title="Lookup Canister"
				fullWidth
			>
				<LookupNodeCanisterForm formRef={formRef} node={node} onProcessNode={setFormData}>
					{nodeType === 'LookupCanister' ? <PreviewRequest type="LookupCanister" /> : <>TODO</>}
				</LookupNodeCanisterForm>
			</Drawer>
			<Dialog open={!!previewError} onClose={() => setPreviewError(null)} title="Error" onCancelText="Close">
				<pre>{previewError}</pre>
			</Dialog>
			<Dialog
				open={!!formData}
				onConfirmText="Confirm"
				onConfirm={handleOnConfirmCycles}
				title="Confirm cycles"
				onCancelText="Close"
				onClose={() => setFormData(null)}
			>
				<Alert severity="error">
					Ensure the correct number of cycles is set. If unsure, use the <b>Preview request</b> to verify. Insufficient
					cycles will cause the call to fail.
				</Alert>
			</Dialog>
		</>
	);
};

type FormData<T extends NodeSourceType> = T extends 'LookupCanister' ? LookupCanisterFormValues : InputNodeFormValues;
const PreviewRequest = ({ type }: { type: NodeSourceType }) => {
	const { getValues, trigger } = useFormContext<FormData<typeof type>>();

	const circuitId = useGetParam('circuitId');
	const nodeCanisterId = useGetNodeCanisterId(Number(circuitId));
	const { mutate: preview, data, error, isLoading: isPreviewLoading } = usePreview();

	const response = useMemo(() => {
		if (error) {
			return JSON.stringify(error, null, 4);
		}

		if (!data) {
			return '';
		}

		if ('Ok' in data) {
			return JSON.stringify(JSON.parse(data.Ok), null, 4);
		}

		return JSON.stringify(data, null, 4);
	}, [data, error]);

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
								args: getLookupCanisterValuesAsArg(values.args),
								canister: toPrincipal(values.canisterId),
								description: values.description.length ? [values.description] : [],
								method: values.methodName,
								name: values.name,
								cycles: BigInt(values.cycles)
							});
						}
					}}
				>
					Send preview request
				</Button>
				<B2>
					Before querying the desired canister, ensure Canister ID{' '}
					<CopyTextButton textToCopy={nodeCanisterId.toString()}>{nodeCanisterId.toString()}</CopyTextButton> is
					authorized.
				</B2>
				<StandaloneEditor mode="javascript" value={response} isReadOnly height="100%" />
			</Stack>
		</>
	);
};
