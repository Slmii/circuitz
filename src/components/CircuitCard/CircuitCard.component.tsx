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
				backgroundColor: 'transparent',
				border: theme => `3px solid ${theme.palette.primary.main}`,
				position: 'relative',
				'&:hover': {
					borderRadius: 0,
					boxShadow: theme => `5px 5px 0px 0px ${theme.palette.secondary.main}}`
				}
			}}
		>
			{children}
		</Paper>
	);
};
