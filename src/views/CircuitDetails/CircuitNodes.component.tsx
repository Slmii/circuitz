import { Stack, ButtonBase } from '@mui/material';
import { Icon } from 'components/Icon';
import { B1 } from 'components/Typography';
import { useState } from 'react';
import { InputNodeDrawer } from 'components/NodeDrawer';
import { Node } from 'lib/types/Node';

interface DialogState {
	node?: Node;
	type: 'input' | 'output';
}

export const CircuitNodes = ({ nodes }: { nodes: Node[] }) => {
	const [isDialogOpen, setIsDialogOpen] = useState<DialogState | null>({ node: undefined, type: 'input' });

	return (
		<>
			{!nodes.length && (
				// Show 'Add Input Node' button if there are no nodes at all
				<Stack
					direction="row"
					alignItems="center"
					justifyContent="flex-start"
					component={ButtonBase}
					onClick={() => setIsDialogOpen({ type: 'input' })}
					sx={{
						p: 2,
						width: 600,
						backgroundColor: 'background.default',
						borderRadius: 1,
						border: theme => `1px solid ${theme.palette.divider}`
					}}
				>
					<Icon icon="add-square" spacingRight fontSize="small" />
					<B1>Add Input Node</B1>
				</Stack>
			)}
			<InputNodeDrawer open={isDialogOpen?.type === 'input'} onClose={() => setIsDialogOpen(null)} />
		</>
	);
};
