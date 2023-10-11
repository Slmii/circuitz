import { ButtonBase, Paper, Stack } from '@mui/material';
import { PropsWithChildren } from 'react';

export const CircuitCard = ({ onClick, children }: PropsWithChildren<{ onClick?: () => void }>) => {
	return (
		<Paper
			elevation={0}
			component={onClick ? ButtonBase : Stack}
			onClick={onClick}
			alignItems="center"
			justifyContent="center"
			sx={{
				p: 2,
				height: 300,
				width: '100%',
				border: theme => `2px solid ${theme.palette.primary.main}`,
				position: 'relative'
			}}
		>
			{children}
		</Paper>
	);
};
