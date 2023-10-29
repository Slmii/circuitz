import MuiCheckbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import { Controller } from 'react-hook-form';
import slugify from 'slugify';

export const Checkbox = ({
	name,
	label,
	disabled,
	onChange
}: {
	label?: string;
	name: string;
	disabled?: boolean;
	onChange?: (checked: boolean) => void;
}) => {
	return (
		<FormGroup row>
			<FormControlLabel
				className={!label ? 'no-label' : undefined}
				control={
					<Controller
						name={name}
						render={({ field }) => (
							<MuiCheckbox
								inputProps={{ 'aria-labelledby': `${slugify(name)}-checkbox` }}
								disabled={disabled}
								checked={field.value}
								size="small"
								color="secondary"
								onChange={(e, checked) => {
									field.onChange(e);
									onChange?.(checked);
								}}
							/>
						)}
					/>
				}
				label={label}
				labelPlacement="end"
			/>
		</FormGroup>
	);
};

export const StandaloneCheckbox = ({
	name,
	label,
	checked,
	disabled,
	onChange
}: {
	label?: string;
	name: string;
	checked: boolean;
	disabled?: boolean;
	onChange?: (checked: boolean) => void;
}) => {
	return (
		<FormGroup row>
			<FormControlLabel
				className={!label ? 'no-label' : undefined}
				control={
					<MuiCheckbox
						inputProps={{ 'aria-labelledby': `${slugify(name)}-checkbox` }}
						disabled={disabled}
						checked={checked}
						size="small"
						color="secondary"
						onChange={(_, checked) => {
							onChange?.(checked);
						}}
					/>
				}
				label={label}
				labelPlacement="end"
			/>
		</FormGroup>
	);
};
