import FormLabel from '@mui/material/FormLabel';
import type { LabelProps } from './Label.types';
import type { FormLabelProps } from '@mui/material/FormLabel/FormLabel';
import Box from '@mui/material/Box';

export const Label = ({
	required,
	label,
	secondaryLabel,
	radioOrCheckbox,
	disabled,
	...rest
}: FormLabelProps & LabelProps) => {
	return (
		<FormLabel
			component="legend"
			required={required}
			{...rest}
			sx={{
				fontSize: radioOrCheckbox ? 14 : 10,
				color: disabled ? 'text.secondary' : radioOrCheckbox ? 'text.primary' : 'text.secondary',
				fontWeight: radioOrCheckbox ? 'regular' : 'bold',
				...rest.sx
			}}
		>
			{label}
			{secondaryLabel && (
				<>
					{' '}
					<Box fontWeight="regular" component="span">
						{secondaryLabel}
					</Box>
				</>
			)}
		</FormLabel>
	);
};
