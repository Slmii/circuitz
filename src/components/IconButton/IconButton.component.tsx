import MUIIconButton from '@mui/material/IconButton';
import { Icon } from 'components/Icon';
import { CircularProgress } from 'components/Progress';
import { Tooltip } from 'components/Tooltip';
import { CustomIconButtonProps } from './IconButton.types';
import slugify from 'slugify';
import { forwardRef } from 'react';

const AdjustedIconButton = forwardRef<HTMLButtonElement, CustomIconButtonProps>(
	({ icon, loading, color, disabled, ...props }, ref) => {
		// Rendering a div instead of a button when disabled to enable Tooltip appearance
		const adjustedButtonProps = {
			component: disabled ? 'div' : undefined,
			onClick: disabled ? undefined : props.onClick
		};

		return (
			<MUIIconButton {...props} {...adjustedButtonProps} color={color} disabled={disabled || loading} ref={ref}>
				{loading ? <CircularProgress /> : <Icon icon={icon} fontSize={props.size} />}
			</MUIIconButton>
		);
	}
);

export const IconButton = ({ tooltip, ...props }: CustomIconButtonProps) => {
	if (!tooltip) {
		return <AdjustedIconButton {...props} />;
	}

	return (
		<Tooltip label={tooltip}>
			<AdjustedIconButton aria-label={slugify(tooltip)} {...props} />
		</Tooltip>
	);
};
