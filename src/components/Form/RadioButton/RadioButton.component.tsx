import FormControlLabel from '@mui/material/FormControlLabel';
import { Controller } from 'react-hook-form';
import slugify from 'slugify';
import { RadioButtonProps } from './RadioButton.types';
import Stack from '@mui/material/Stack';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { FormLabel } from '@mui/material';

export const RadioButton = ({ name, label, disabled, row, required, onChange, options }: RadioButtonProps) => {
	return (
		<Stack spacing={0.25} direction="column">
			<Controller
				name={name}
				render={({ field, fieldState }) => (
					<FormControl error={Boolean(fieldState.error)} variant="standard">
						{label && (
							<FormLabel component="legend" required={required}>
								{label}
							</FormLabel>
						)}
						<RadioGroup
							color="secondary"
							row={row}
							aria-labelledby={`${slugify(name)}-radio`}
							{...field}
							onChange={e => {
								field.onChange(e);
								onChange?.(e.target.value);
							}}
						>
							{options.map(option => (
								<FormControlLabel
									key={option.id}
									value={option.id}
									disabled={disabled}
									control={<Radio size="small" color="primary" />}
									label={option.label}
									labelPlacement="end"
								/>
							))}
						</RadioGroup>
						{fieldState.error ? <FormHelperText error>{fieldState.error.message}</FormHelperText> : null}
					</FormControl>
				)}
			/>
		</Stack>
	);
};
