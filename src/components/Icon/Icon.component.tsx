import { icons } from 'components/icons';
import { Tooltip } from 'components/Tooltip';
import { IconProps } from './Icon.types';

export const Icon = ({ spacingLeft, spacingRight, icon, tooltip, ...props }: IconProps) => {
	const IconComponent = icons[icon as keyof typeof icons];

	return (
		<Tooltip label={tooltip ?? ''}>
			<IconComponent
				{...props}
				sx={{
					...props.sx,
					ml: spacingLeft ? 1 : 0,
					mr: spacingRight ? 1 : 0
				}}
			/>
		</Tooltip>
	);
};
