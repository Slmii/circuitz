import { Divider, Stack } from '@mui/material';
import { OutputNodeDrawerProps, OutputNodeFormValues } from '../NodeDrawers.types';
import { Drawer } from 'components/Drawer';
import { Alert } from 'components/Alert';
import { H3, H5 } from 'components/Typography';
import { Field } from 'components/Form/Field';
import { Form } from 'components/Form';
import { useAddNode, useEditNode, useFormSubmit, useGetParam, useModal, useSnackbar } from 'lib/hooks';
import { Select } from 'components/Form/Select';
import { APPLICATION_OPTIONS, NODE_ADD_SUCCESS, NODE_EDIT_SUCCESS } from 'lib/constants';
import { ConnectorField } from 'components/Shared';
import { DeleteNodeModalProps } from 'lib/types';
import { getNodeMetaData } from 'lib/utils';

export const OutputNodeDrawer = ({ node, open, onClose }: OutputNodeDrawerProps) => {
	const { formRef, submitter } = useFormSubmit();
	const circuitId = useGetParam('circuitId');
	const { successSnackbar } = useSnackbar();
	const { openModal } = useModal<DeleteNodeModalProps>('DELETE_NODE');

	const { mutateAsync: addNode, isPending: isAddNodePending } = useAddNode();
	const { mutateAsync: editNode, isPending: isEditNodePending } = useEditNode();

	const handleOnSubmit = async (data: OutputNodeFormValues) => {
		if (!node) {
			// await addNode({
			// 	circuitId: Number(circuitId),
			// 	data: {
			// 		Output
			// 	}
			// });

			successSnackbar(NODE_ADD_SUCCESS);
		} else {
			// await editNode({
			// 	nodeId: node.id,
			// 	data
			// });

			successSnackbar(NODE_EDIT_SUCCESS);
		}
	};

	return (
		<Drawer
			onClose={onClose}
			onSubmit={submitter}
			isOpen={open}
			isLoading={isAddNodePending || isEditNodePending}
			fullWidth
			title={
				<Stack>
					<H3>Output</H3>
					{node && <H5 fontWeight="bold">{getNodeMetaData(node).name}</H5>}
				</Stack>
			}
			onDelete={
				node
					? () => {
							openModal({
								nodeId: node.id,
								onSuccess: () => onClose()
							});
					  }
					: undefined
			}
		>
			{open && (
				<Form<OutputNodeFormValues>
					action={handleOnSubmit}
					defaultValues={{
						name: '',
						description: '',
						connector: ''
					}}
					myRef={formRef}
					// schema={inputCanisterSchema}
					render={() => (
						<>
							<Alert severity="info">An Ouput Node sends data to the outside world.</Alert>
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
									<ConnectorField node={node} />
								</Stack>
							</Stack>
						</>
					)}
				/>
			)}
		</Drawer>
	);
};
