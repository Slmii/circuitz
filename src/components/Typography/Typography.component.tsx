import { TypographyProps, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

interface CustomTypographyProps extends TypographyProps {
	lineClamp?: number;
}

const lineClampVars = (lineClamp?: number): React.CSSProperties => {
	return {
		display: lineClamp ? '-webkit-box' : undefined,
		WebkitLineClamp: lineClamp,
		WebkitBoxOrient: lineClamp ? 'vertical' : undefined,
		overflow: lineClamp ? 'hidden' : undefined
	};
};

export const Title = ({ children, lineClamp, ...props }: PropsWithChildren<CustomTypographyProps>) => {
	return (
		<Typography
			{...props}
			sx={{
				...lineClampVars(lineClamp),
				...props.sx
			}}
			variant="h3"
			fontWeight="bold"
		>
			{children}
		</Typography>
	);
};

export const SubTitle = ({ children, lineClamp, ...props }: PropsWithChildren<CustomTypographyProps>) => {
	return (
		<Typography
			{...props}
			sx={{
				...lineClampVars(lineClamp),
				...props.sx
			}}
			variant="h5"
			fontWeight="bold"
		>
			{children}
		</Typography>
	);
};

export const Paragraph = ({ children, lineClamp, ...props }: PropsWithChildren<CustomTypographyProps>) => {
	return (
		<Typography
			{...props}
			sx={{
				...lineClampVars(lineClamp),
				...props.sx
			}}
			variant="body1"
		>
			{children}
		</Typography>
	);
};

export const Caption = ({ children, lineClamp, ...props }: PropsWithChildren<CustomTypographyProps>) => {
	return (
		<Typography
			{...props}
			sx={{
				...lineClampVars(lineClamp),
				...props.sx
			}}
			variant="caption"
		>
			{children}
		</Typography>
	);
};
