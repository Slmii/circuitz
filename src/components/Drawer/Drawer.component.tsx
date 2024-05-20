import { Box, Drawer as MuiDrawer, Stack } from '@mui/material';
import { Button } from 'components/Button';
import { IconButton } from 'components/IconButton';
import { B1, H3 } from 'components/Typography';
import { PropsWithChildren, useState } from 'react';
import { NodeDrawerProps } from './Drawer.types';
import { useRecoilState } from 'recoil';
import { isFormDirtyState } from 'lib/recoil';
import { Dialog } from 'components/Dialog';
import { useDevice } from 'lib/hooks';

export const Drawer = ({
	title,
	isOpen,
	isDisabled,
	isLoading,
	fullWidth,
	disableHandlebarsHelpers,
	onClose,
	onSubmit,
	onDelete,
	children
}: PropsWithChildren<NodeDrawerProps>) => {
	const { isMdDown } = useDevice();

	const [isUnsavedChangesDialogOpen, setIsUnsavedChangesDialogOpen] = useState(false);
	const [isFormDirty, setIsFormDirty] = useRecoilState(isFormDirtyState);

	return (
		<>
			<MuiDrawer
				anchor={isMdDown ? 'bottom' : 'right'}
				open={isOpen}
				onClose={() => {
					if (isFormDirty) {
						setIsUnsavedChangesDialogOpen(true);
					} else {
						onClose();
					}
				}}
				PaperProps={{
					sx: {
						width: fullWidth ? '90%' : 700,
						borderLeft: theme => `1px solid ${theme.palette.divider}`
					}
				}}
				sx={
					isMdDown
						? {
								position: 'relative',
								'& .MuiDrawer-paper': {
									borderTopLeftRadius: 8,
									borderTopRightRadius: 8,
									borderTop: theme => `1px solid ${theme.palette.divider}`,
									borderLeft: 'none',
									borderRight: 'none',
									borderRadius: 0,
									width: '100%',
									height: '100%'
								}
						  }
						: undefined
				}
			>
				<Stack
					direction={['column', 'row']}
					alignItems="center"
					sx={{
						gap: 2,
						py: 2,
						px: 4,
						backgroundColor: 'background.paper',
						width: '100%',
						borderBottom: theme => `1px solid ${theme.palette.divider}`
					}}
				>
					{typeof title === 'string' ? <H3>{title}</H3> : title}
					<Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
						{!disableHandlebarsHelpers && (
							<>
								<Button
									sx={{ minWidth: 'fit-content' }}
									variant="contained"
									color="secondary"
									href="https://handlebarsjs.com/guide/expressions.html#basic-usage"
									target="_blank"
								>
									Handlebars guide
								</Button>
								<Button
									sx={{ minWidth: 'fit-content' }}
									variant="outlined"
									color="secondary"
									href="https://www.npmjs.com/package/just-handlebars-helpers#helpers"
									target="_blank"
								>
									Handlebars helpers
								</Button>
							</>
						)}
						<IconButton tooltip="Close" icon="close-linear" onClick={onClose} />
					</Stack>
				</Stack>
				<Box sx={{ p: 4, height: '100%', overflowY: 'auto' }}>{children}</Box>
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
					<Button
						onClick={() => {
							setIsFormDirty(false);
							setIsUnsavedChangesDialogOpen(false);
							onSubmit();
						}}
						loading={isLoading}
						disabled={isDisabled}
						variant="contained"
					>
						Save
					</Button>
					<Button variant="outlined" disabled={isDisabled || isLoading} onClick={onClose}>
						Cancel
					</Button>
					{onDelete && (
						<Button variant="contained" color="error" disabled={isDisabled || isLoading} onClick={onDelete}>
							Delete
						</Button>
					)}
				</Stack>
			</MuiDrawer>
			<Dialog
				title="Unsaved changes"
				open={isUnsavedChangesDialogOpen}
				onClose={() => {
					setIsUnsavedChangesDialogOpen(false);
					setIsFormDirty(false);
					onClose();
				}}
				onConfirm={() => setIsUnsavedChangesDialogOpen(false)}
				onCancelText="Discard changes"
				onConfirmText="Go back to editing"
			>
				<B1>You have unsaved changes. Are you sure you want to leave?</B1>
			</Dialog>
		</>
	);
};
