import { ButtonBase, Paper, Stack } from '@mui/material';
import { PropsWithChildren } from 'react';

export const CircuitCard = ({ onClick, children }: PropsWithChildren<{ onClick?: () => void }>) => {
	return (
		<Paper
			component={onClick ? ButtonBase : Stack}
			onClick={onClick}
			alignItems="center"
			justifyContent="center"
			sx={{
				p: 2,
				height: 300,
				width: '100%',
				backgroundColor: 'background.default',
				border: theme => `1px solid ${theme.palette.primary.main}`,
				position: 'relative'
			}}
		>
			{children}
		</Paper>
	);
};
