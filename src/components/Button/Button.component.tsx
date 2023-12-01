import MuiButton, { ButtonProps } from '@mui/material/Button';
import { CircularProgress } from 'components/Progress';
import { Tooltip } from 'components/Tooltip';
import { Link as RouterLink } from 'react-router-dom';
import { ButtonLinkProps, CustomButtonProps } from './Button.types';
import { Icon } from 'components/Icon';
import Box from '@mui/material/Box';
import { useCopyToClipboard } from 'lib/hooks';
import { PropsWithChildren } from 'react';

export const Button = ({
	tooltip,
	loading,
	startIcon,
	endIcon,
	startImage,
	endImage,
	children,
	...props
}: CustomButtonProps) => {
	const button = (
		<MuiButton
			{...props}
			disabled={props.disabled || loading}
			startIcon={
				!loading ? (
					startIcon ? (
						<Icon icon={startIcon} />
					) : startImage ? (
						<Box component="img" borderRadius={1} src={startImage} alt="" height={20} />
					) : undefined
				) : undefined
			}
			endIcon={
				!loading ? (
					endIcon ? (
						<Icon icon={endIcon} />
					) : endImage ? (
						<Box component="img" borderRadius={1} src={startImage} alt="" height={20} />
					) : undefined
				) : undefined
			}
		>
			{loading ? (
				<CircularProgress
					color="inherit"
					sx={{
						marginRight: 1
					}}
				/>
			) : null}
			{children}
		</MuiButton>
	);

	return (
		<>
			{tooltip ? <Tooltip label={tooltip}>{props.disabled ? <span>{button}</span> : button}</Tooltip> : <>{button}</>}
		</>
	);
};

export const LinkButton = (props: ButtonLinkProps) => {
	return <Button {...props} component={RouterLink} />;
};

export const TextButton = ({ children, ...props }: ButtonProps) => {
	return (
		<MuiButton
			disableElevation
			component="code"
			size="small"
			color="secondary"
			variant="contained"
			sx={{ minHeight: 'unset', px: 0.5 }}
			{...props}
		>
			{children}
		</MuiButton>
	);
};

export const CopyTextButton = ({ textToCopy, children }: PropsWithChildren<{ textToCopy: string }>) => {
	const { copy } = useCopyToClipboard();

	return <TextButton onClick={() => copy(textToCopy)}>{children}</TextButton>;
};
