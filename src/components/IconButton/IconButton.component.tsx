import MUIIconButton from '@mui/material/IconButton';
import { CustomIconButtonProps } from './IconButton.types';
import { Tooltip } from 'components/Tooltip';
import { CircularProgress } from 'components/Progress';
import { Icon } from 'components/Icon';

export const IconButton = ({ icon, tooltip, loading, ...props }: CustomIconButtonProps) => {
	return (
		<Tooltip label={tooltip ?? ''}>
			{props.disabled ? (
				<span>
					<MUIIconButton {...props} disabled={props.disabled || loading}>
						{loading ? <CircularProgress /> : <Icon icon={icon} fontSize={props.size} />}
					</MUIIconButton>
				</span>
			) : (
				<MUIIconButton {...props} disabled={props.disabled || loading}>
					{loading ? <CircularProgress /> : <Icon icon={icon} fontSize={props.size} />}
				</MUIIconButton>
			)}
		</Tooltip>
	);
};
