import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MuiSwitch from '@mui/material/Switch';
import { StandaloneSwitchProps, SwitchProps } from './Switch.types';
import { Controller } from 'react-hook-form';
import slugify from 'slugify';
import { styled } from '@mui/material';
import { CircularProgress } from 'components/Progress';

const StyledFormControlLabel = styled(FormControlLabel)({
	margin: 0
});

export const StandaloneSwitch = ({
	label,
	value,
	name,
	disabled,
	labelPlacement = 'end',
	isLoading,
	onChange
}: StandaloneSwitchProps) => {
	return (
		<FormGroup row>
			{isLoading ? (
				<CircularProgress color="secondary" />
			) : (
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
					label={label}
					labelPlacement={labelPlacement}
				/>
			)}
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
				label={label}
				labelPlacement="end"
			/>
		</FormGroup>
	);
};
