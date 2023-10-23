import { useFormSubmit } from 'lib/hooks/useFormSubmit';
import { useAddNode, useEditNode, useGetNodeCanisterId, useGetParam, usePreview } from 'lib/hooks';
import { NodeType } from 'declarations/nodes.declarations';
import { LookupNodeCanisterForm } from './LookupNodeCanisterForm.component';
import { InputNodeDrawerProps, InputNodeFormValues, LookupCanisterFormValues } from '../NodeDrawers.types';
import { Drawer } from 'components/Drawer';
import { Divider, Stack } from '@mui/material';
import { Button } from 'components/Button';
import { B2, H5 } from 'components/Typography';
import { Editor } from 'components/Editor';
import { useFormContext } from 'react-hook-form';
import { NodeSourceType } from 'lib/types';
import { toPrincipal, getLookupCanisterValuesAsArg } from 'lib/utils';
import { Dialog } from 'components/Dialog';
import { useMemo, useState } from 'react';
import { CopyText } from 'components/CopyText';

export const LookupNodeDrawer = ({ node, nodeType, open, onClose }: InputNodeDrawerProps) => {
	const [previewError, setPreviewError] = useState<string | null>(null);
	const circuitId = useGetParam('circuitId');
	const { formRef, submitter } = useFormSubmit();

	const { mutateAsync: addNode, isLoading: isAddNodeLoading } = useAddNode();
	const { mutateAsync: editNode, isLoading: isEditNodeLoading } = useEditNode();
	const { mutateAsync: preview, isLoading: isPreviewLoading } = usePreview();

	const handleOnSubmit = async (data: NodeType) => {
		if ('LookupCanister' in data) {
			const previewResponse = await preview({
				args: data.LookupCanister.args,
				canister: toPrincipal(data.LookupCanister.canister.toString()),
				description: data.LookupCanister.description,
				method: data.LookupCanister.method,
				name: data.LookupCanister.name,
				cycles: data.LookupCanister.cycles
			});

			if ('Err' in previewResponse) {
				setPreviewError(JSON.stringify(previewResponse, null, 4));
				return;
			}
		}

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
	};

	// TODO: use to seperate forms
	nodeType;

	return (
		<>
			<Drawer
				onClose={onClose}
				onSubmit={submitter}
				isOpen={open}
				isLoading={isAddNodeLoading || isEditNodeLoading || isPreviewLoading}
				title="Lookup Canister"
				fullWidth
			>
				<LookupNodeCanisterForm formRef={formRef} node={node} onProcessNode={handleOnSubmit}>
					<PreviewRequest type="LookupCanister" />
				</LookupNodeCanisterForm>
			</Drawer>
			<Dialog open={!!previewError} onClose={() => setPreviewError(null)} title="Error" onCancelText="Close">
				<pre>{previewError}</pre>
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
					Make sure to authorize Canister ID{' '}
					<CopyText textToCopy={nodeCanisterId.toString()}> {nodeCanisterId.toString()} </CopyText> before accessing the
					canister you want to query.
				</B2>
				<Editor mode="javascript" value={response} isReadOnly height="100%" />
			</Stack>
		</>
	);
};
