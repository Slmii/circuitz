import { Box, Drawer, Stack } from '@mui/material';
import { Button } from 'components/Button';
import { IconButton } from 'components/IconButton';
import { H3 } from 'components/Typography';
import { PropsWithChildren } from 'react';
import { NodeDrawerProps } from './NodeDrawer.types';

export const NodeDrawer = ({
	title,
	isOpen,
	isLoading,
	onClose,
	onSubmit,
	children
}: PropsWithChildren<NodeDrawerProps>) => {
	return (
		<Drawer anchor="right" open={isOpen} onClose={onClose}>
			<Stack
				direction="row"
				justifyContent="space-between"
				sx={{
					py: 2,
					px: 4,
					backgroundColor: 'background.paper',
					width: '100%',
					borderBottom: theme => `1px solid ${theme.palette.divider}`
				}}
			>
				<Stack direction="row" alignItems="center" spacing={2}>
					<H3>{title}</H3>
					<img src="/public/logos/icp.png" style={{ width: 24, height: 24 }} />
				</Stack>
				<IconButton tooltip="Close" icon="close" onClick={onClose} />
			</Stack>
			<Box sx={{ p: 4, width: 700, height: '100%', overflowY: 'auto' }}>{children}</Box>
			<Stack
				direction="row"
				justifyContent="flex-end"
				spacing={2}
				sx={{
					py: 2,
					px: 4,
					backgroundColor: 'background.default',
					width: '100%',
					borderTop: theme => `1px solid ${theme.palette.divider}`
				}}
			>
				<Button onClick={onSubmit} loading={isLoading} variant="contained">
					Save
				</Button>
				<Button variant="outlined" disabled={isLoading} onClick={onClose}>
					Cancel
				</Button>
			</Stack>
		</Drawer>
	);
};
