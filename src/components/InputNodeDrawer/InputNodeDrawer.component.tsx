import { useFormSubmit } from 'lib/hooks/useFormSubmit';
import { useAddNode, useGetParam } from 'lib/hooks';
import { NodeType } from 'declarations/nodes.declarations';
import { InputCanisterForm } from './Forms/InputCanisterForm.component';
import { H5 } from 'components/Typography';
import { ButtonBase, Paper, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { NodeSource, NodeSourceType } from 'lib/types';
import { InputNodeDrawerProps } from './InputNodeDrawer.types';
import { Drawer } from 'components/Drawer';
import { Back } from 'components/Navigation';

const NODE_SOURCES: NodeSource[] = [
	{
		id: 'canister',
		label: 'Canister',
		icon: 'icp',
		disabled: false
	},
	{
		id: 'request',
		label: 'Coming soon',
		icon: 'http',
		disabled: true
	}
];

export const InputNodeDrawer = ({ node, open, onClose }: InputNodeDrawerProps) => {
	const [nodeSource, setNodeSource] = useState<NodeSourceType | null>(null);
	const circuitId = useGetParam('circuitId');
	const { formRef, submitter } = useFormSubmit();

	const { mutateAsync: addNode, isLoading: isAddNodeLoading } = useAddNode();

	useEffect(() => {
		// Set node source if we are in 'Edit' mode
		if (node) {
			setNodeSource('Canister' in node.nodeType ? 'canister' : 'request');
		}
	}, [node]);

	const handleOnSubmit = async (data: NodeType) => {
		await addNode({
			circuitId: Number(circuitId),
			data
		});

		onClose();
	};

	return (
		<Drawer
			onClose={() => {
				onClose();

				// If we are in 'Create' mode, reset node source
				if (!node) {
					// Reset node source after drawer is closed
					setTimeout(() => setNodeSource(null), 500);
				}
			}}
			onSubmit={submitter}
			isOpen={open}
			isLoading={isAddNodeLoading}
			isDisabled={!nodeSource}
			title={`Input Node${nodeSource ? ` - ${nodeSource.toUpperCase()}` : ''}`}
		>
			{nodeSource ? (
				<Stack alignItems="flex-start" spacing={2}>
					{!node && <Back label="Select Node Source" onBack={() => setNodeSource(null)} />}
					<InputCanisterForm formRef={formRef} node={node} onProcessNode={handleOnSubmit} />
				</Stack>
			) : (
				<Stack spacing={2}>
					<H5 fontWeight="bold">Select Node Source</H5>
					<Stack direction="row" spacing={2}>
						{NODE_SOURCES.map(source => (
							<Paper
								key={source.id}
								disabled={source.disabled}
								onClick={() => setNodeSource(source.id)}
								component={ButtonBase}
								sx={{
									minWidth: 150,
									display: 'flex',
									flexDirection: 'column',
									gap: 1,
									border: theme => `1px solid ${source.id === nodeSource ? theme.palette.primary.main : 'transparent'}`,
									p: 2,
									opacity: source.disabled ? 0.5 : 1
								}}
							>
								<img src={`/public/logos/${source.icon}.png`} style={{ width: 66, height: 66 }} />
								<H5>{source.label}</H5>
							</Paper>
						))}
					</Stack>
				</Stack>
			)}
		</Drawer>
	);
};
