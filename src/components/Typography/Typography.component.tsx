import { TypographyProps, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

export const Title = ({ children, ...props }: PropsWithChildren<TypographyProps>) => {
	return (
		<Typography {...props} variant="h3" fontWeight="bold">
			{children}
		</Typography>
	);
};

export const SubTitle = ({ children, ...props }: PropsWithChildren<TypographyProps>) => {
	return (
		<Typography {...props} variant="h5" fontWeight="bold">
			{children}
		</Typography>
	);
};

export const Paragraph = ({ children, ...props }: PropsWithChildren<TypographyProps>) => {
	return (
		<Typography {...props} variant="body1">
			{children}
		</Typography>
	);
};

export const Caption = ({ children, ...props }: PropsWithChildren<TypographyProps>) => {
	return (
		<Typography {...props} variant="caption">
			{children}
		</Typography>
	);
};
