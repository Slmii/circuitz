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

const StyledSwitch = styled(MuiSwitch)(({ theme }) => ({
	width: 50,
	height: 30,
	padding: 0,
	'& .MuiSwitch-switchBase': {
		padding: 0,
		margin: 5,
		transition: theme.transitions.create(['transform'], {
			duration: 250
		}),
		color: theme.palette.divider,
		'&.Mui-checked': {
			color: theme.palette.primary.main,
			marginLeft: theme.spacing(1),
			transform: 'translateX(16px)',
			'& + .MuiSwitch-track': {
				backgroundColor: theme.palette.secondary.dark,
				opacity: 1
			}
		},
		'&.Mui-focusVisible .MuiSwitch-thumb': {
			color: '#33cf4d',
			border: '6px solid #fff'
		},
		'&.Mui-disabled .MuiSwitch-thumb': {
			opacity: 0.5
		},
		'&.Mui-disabled + .MuiSwitch-track': {
			opacity: 0.5
		}
	},
	'& .MuiSwitch-thumb': {
		boxSizing: 'border-box',
		width: 20,
		height: 20
	},
	'& .MuiSwitch-track': {
		borderRadius: 0,
		backgroundColor: theme.palette.divider,
		opacity: 1,
		border: `1px solid ${theme.palette.divider}`,
		transition: theme.transitions.create(['background-color'], {
			duration: 250
		})
	}
}));

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
					<StyledSwitch
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
							<StyledSwitch
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
