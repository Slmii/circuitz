import { useFormSubmit } from 'lib/hooks/useFormSubmit';
import { useAddNode, useEditNode, useGetParam } from 'lib/hooks';
import { NodeType } from 'declarations/nodes.declarations';
import { LookupCanisterForm } from './Forms/LookupCanisterForm.component';
import { InputNodeDrawerProps } from './NodeDrawers.types';
import { Drawer } from 'components/Drawer';
import { Box, Divider, Stack } from '@mui/material';
import { Button } from 'components/Button';
import { H5 } from 'components/Typography';
import { Editor } from 'components/Editor';

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

	return (
		<Drawer
			onClose={onClose}
			onSubmit={submitter}
			isOpen={open}
			isLoading={isAddNodeLoading || isEditNodeLoading}
			title="Lookup Canister"
			fullWidth
		>
			<Stack direction="row" spacing={4}>
				<Box width="50%">
					{nodeType === 'LookupCanister' ? (
						<LookupCanisterForm formRef={formRef} node={node} onProcessNode={handleOnSubmit} />
					) : (
						<div>LookupHttpRequestForm</div>
					)}
				</Box>
				<Divider orientation="vertical" flexItem />
				<Stack direction="column" spacing={2} width="50%">
					<H5 fontWeight="bold">Preview data</H5>
					<Button variant="contained" size="large" startIcon="infinite">
						Send preview request
					</Button>
					<Editor mode="javascript" value="// Preview data" isReadOnly height="100%" />
				</Stack>
			</Stack>
		</Drawer>
	);
};
