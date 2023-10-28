import MuiDialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Fade from '@mui/material/Fade';
import { TransitionProps } from '@mui/material/transitions';
import React, { PropsWithChildren } from 'react';
import { Button } from 'components/Button';
import { DialogProps } from './Dialog.types';
import { IconButton } from 'components/IconButton';
import slugify from 'slugify';
import DialogActions from '@mui/material/DialogActions';
import Slide from '@mui/material/Slide';
import { useDevice } from 'lib/hooks';

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		children: React.ReactElement<any, any>;
	},
	ref: React.Ref<unknown>
) {
	const { isMobile } = useDevice();

	if (isMobile) {
		return <Slide direction="up" ref={ref} {...props} />;
	}

	return <Fade ref={ref} {...props} />;
});

export const Dialog = ({
	open,
	title,
	customAction,
	width,
	onClose,
	onConfirmText,
	onCancelText,
	onConfirmDisabled,
	onConfirmLoading,
	onCancelDisabled,
	onCancelLoading,
	onConfirmColor = 'primary',
	onConfirm,
	children
}: PropsWithChildren<DialogProps>) => {
	const { isMobile } = useDevice();

	return (
		<MuiDialog
			open={open}
			onClose={onClose}
			aria-labelledby={`dialog-${slugify(typeof title === 'string' ? title : 'open')}`}
			aria-describedby={`dialog-description-${slugify(typeof title === 'string' ? title : 'open')}`}
			TransitionComponent={Transition}
			fullWidth
			maxWidth={width}
		>
			<IconButton
				sx={{
					position: 'absolute',
					top: theme => theme.spacing(1),
					right: theme => theme.spacing(2)
				}}
				color="inherit"
				tooltip="Close"
				icon="close-linear"
				onClick={onClose}
			/>
			{title ? <DialogTitle>{title}</DialogTitle> : null}
			<DialogContent>{children}</DialogContent>
			<DialogActions>
				{customAction ?? (
					<>
						{onConfirm && onConfirmText ? (
							<Button
								variant="contained"
								color={onConfirmColor}
								fullWidth={isMobile}
								onClick={onConfirm}
								loading={onConfirmLoading}
								disabled={onConfirmDisabled}
							>
								{onConfirmText}
							</Button>
						) : null}
						{onCancelText ? (
							<Button
								variant="outlined"
								color="primary"
								fullWidth={isMobile}
								loading={onCancelLoading}
								onClick={onClose}
								disabled={onCancelDisabled}
							>
								{onCancelText}
							</Button>
						) : null}
					</>
				)}
			</DialogActions>
		</MuiDialog>
	);
};
