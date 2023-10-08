import FormControlLabel from '@mui/material/FormControlLabel';
import { Label } from 'components/Form/Label';
import { Controller } from 'react-hook-form';
import slugify from 'slugify';
import { RadioButtonProps } from './RadioButton.types';
import Stack from '@mui/material/Stack';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

export const RadioButton = ({ name, label, disabled, row, required, onChange, options }: RadioButtonProps) => {
	return (
		<Stack spacing={0.25} direction="column">
			<Controller
				name={name}
				render={({ field, fieldState }) => (
					<FormControl error={Boolean(fieldState.error)} variant="standard">
						{label && <Label required={required} label={label} />}
						<RadioGroup
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
									label={<Label label={option.label} radioOrCheckbox disabled={disabled} />}
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
