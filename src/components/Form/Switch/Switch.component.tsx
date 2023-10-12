import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MuiSwitch from '@mui/material/Switch';
import { StandaloneSwitchProps, SwitchProps } from './Switch.types';
import { Label } from '../Label';
import { Controller } from 'react-hook-form';
import slugify from 'slugify';
import { styled } from '@mui/material';

const StyledFormControlLabel = styled(FormControlLabel)({
	margin: 0
});

export const StandaloneSwitch = ({
	label,
	value,
	name,
	disabled,
	labelPlacement = 'end',
	onChange
}: StandaloneSwitchProps) => {
	return (
		<FormGroup row>
			<StyledFormControlLabel
				control={
					<MuiSwitch
						color="secondary"
						inputProps={{ 'aria-labelledby': `${slugify(name)}-switch` }}
						disabled={disabled}
						checked={value}
						size="small"
						onChange={(_e, checked) => onChange(checked)}
					/>
				}
				label={
					label && (
						<Label
							label={label}
							radioOrCheckbox
							disabled={disabled}
							sx={{
								marginLeft: 1,
								marginRight: 1
							}}
						/>
					)
				}
				labelPlacement={labelPlacement}
			/>
		</FormGroup>
	);
};

export const Switch = ({ label, name, disabled, onChange }: SwitchProps) => {
	return (
		<FormGroup row>
			<StyledFormControlLabel
				control={
					<Controller
						name={name}
						render={({ field }) => (
							<MuiSwitch
								color="secondary"
								inputProps={{ 'aria-labelledby': `${slugify(name)}-switch` }}
								disabled={disabled}
								checked={field.value}
								size="small"
								onChange={(e, checked) => {
									field.onChange(e);
									onChange?.(checked);
								}}
							/>
						)}
					/>
				}
				label={label && <Label label={label} radioOrCheckbox disabled={disabled} sx={{ marginLeft: 1 }} />}
				labelPlacement="end"
			/>
		</FormGroup>
	);
};
