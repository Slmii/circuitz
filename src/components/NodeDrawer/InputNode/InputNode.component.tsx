import { useFormSubmit } from 'lib/hooks/useFormSubmit';
import { NodeDrawer } from '../NodeDrawer.component';
import { InputNodeProps } from '../NodeDrawer.types';
import { useAddNode, useGetParam } from 'lib/hooks';
import { NodeType } from 'declarations/nodes.declarations';
import { InputCanisterForm } from './InputCanisterForm.component';
import { H5 } from 'components/Typography';
import { ButtonBase, Paper, Stack } from '@mui/material';
import { useState } from 'react';
import { NodeSource, NodeSourceType } from 'lib/types';

const NODE_SOURCES: NodeSource[] = [
	{
		id: 'canister',
		label: 'Canister',
		icon: 'icp'
	},
	{
		id: 'request',
		label: 'Request',
		icon: 'http'
	}
];

export const InputNode = ({ node, open, onClose }: InputNodeProps) => {
	const [nodeSource, setNodeSource] = useState<NodeSourceType | null>(null);
	const circuitId = useGetParam('circuitId');
	const { formRef, submitter } = useFormSubmit();

	const { mutateAsync: addNode, isLoading: isAddNodeLoading } = useAddNode();

	const handleOnSubmit = async (data: NodeType) => {
		const node = await addNode({
			circuitId: Number(circuitId),
			data
		});

		console.log('Added Node', node);
	};

	return (
		<NodeDrawer
			onClose={() => {
				onClose();
				// Reset node source after drawer is closed
				setTimeout(() => setNodeSource(null), 500);
			}}
			onSubmit={submitter}
			isOpen={open}
			isLoading={isAddNodeLoading}
			isDisabled={!nodeSource}
			title="Input Node"
		>
			{nodeSource ? (
				<InputCanisterForm formRef={formRef} node={node} onProcessNode={handleOnSubmit} />
			) : (
				<Stack spacing={2}>
					<H5 fontWeight="bold">Select Node Source</H5>
					<Stack direction="row" spacing={2}>
						{NODE_SOURCES.map(source => (
							<Paper
								key={source.id}
								onClick={() => setNodeSource(source.id)}
								component={ButtonBase}
								sx={{
									minWidth: 150,
									display: 'flex',
									flexDirection: 'column',
									gap: 1,
									border: theme => `1px solid ${source.id === nodeSource ? theme.palette.primary.main : 'transparent'}`,
									p: 2
								}}
							>
								<img src={`/public/logos/${source.icon}.png`} style={{ width: 66, height: 66 }} />
								<H5>{source.label}</H5>
							</Paper>
						))}
					</Stack>
				</Stack>
			)}
		</NodeDrawer>
	);
};
