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

export const H1 = ({ children, lineClamp, ...props }: PropsWithChildren<CustomTypographyProps>) => {
	return (
		<Typography
			{...props}
			sx={{
				...lineClampVars(lineClamp),
				...props.sx
			}}
			variant="h1"
			fontWeight="bold"
		>
			{children}
		</Typography>
	);
};

export const H2 = ({ children, lineClamp, ...props }: PropsWithChildren<CustomTypographyProps>) => {
	return (
		<Typography
			{...props}
			sx={{
				...lineClampVars(lineClamp),
				...props.sx
			}}
			variant="h2"
			fontWeight="bold"
		>
			{children}
		</Typography>
	);
};

export const H3 = ({ children, lineClamp, ...props }: PropsWithChildren<CustomTypographyProps>) => {
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

export const H4 = ({ children, lineClamp, ...props }: PropsWithChildren<CustomTypographyProps>) => {
	return (
		<Typography
			{...props}
			sx={{
				...lineClampVars(lineClamp),
				...props.sx
			}}
			variant="h4"
			fontWeight="bold"
		>
			{children}
		</Typography>
	);
};

export const H5 = ({ children, lineClamp, ...props }: PropsWithChildren<CustomTypographyProps>) => {
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

export const B1 = ({ children, lineClamp, ...props }: PropsWithChildren<CustomTypographyProps>) => {
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

export const B2 = ({ children, lineClamp, ...props }: PropsWithChildren<CustomTypographyProps>) => {
	return (
		<Typography
			{...props}
			sx={{
				...lineClampVars(lineClamp),
				...props.sx
			}}
			variant="body2"
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
