import { Controller, useFormContext } from 'react-hook-form';
import { DatePickerProps } from './DatePicker.types';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import Stack from '@mui/material/Stack';
import FormHelperText from '@mui/material/FormHelperText';
import { useState } from 'react';
import { icons } from 'components/icons';
import InputAdornment from '@mui/material/InputAdornment';
import { useDevice } from 'lib/hooks';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

const CalendarIcon = icons.calendar;

export const DatePicker = ({
	name,
	label,
	onChange,
	minDate,
	fullWidth,
	maxDate,
	// required = false,
	disabled = false
}: DatePickerProps) => {
	const { isMobile } = useDevice();
	const { control } = useFormContext();
	const [open, setOpen] = useState(false);

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<Stack
					direction="column"
					spacing={0.25}
					sx={{
						position: 'relative',
						width: fullWidth ? '100%' : undefined
					}}
				>
					{isMobile ? (
						<MobileDatePicker
							value={field.value as Date}
							onChange={date => {
								field.onChange(date);
								onChange?.(date);
							}}
							disabled={disabled}
							maxDate={maxDate}
							minDate={minDate}
							open={open}
							label={label}
							showDaysOutsideCurrentMonth
							slotProps={{
								previousIconButton: {
									sx: {
										color: 'inherit'
									}
								},
								nextIconButton: {
									sx: {
										color: 'inherit'
									}
								},
								textField: {
									onClick: () => setOpen(true),
									name,
									error: !!fieldState.error,
									InputProps: {
										startAdornment: (
											<InputAdornment
												position="start"
												sx={{
													padding: 0.5
												}}
											>
												<CalendarIcon fontSize="small" />
											</InputAdornment>
										)
									}
								}
							}}
							onClose={() => setOpen(false)}
						/>
					) : (
						<MuiDatePicker
							value={field.value as Date}
							onChange={date => {
								field.onChange(date);
								onChange?.(date);
							}}
							disabled={disabled}
							maxDate={maxDate}
							minDate={minDate}
							open={open}
							showDaysOutsideCurrentMonth
							slotProps={{
								inputAdornment: {
									sx: {
										display: 'none'
									}
								},
								previousIconButton: {
									sx: {
										color: 'inherit'
									}
								},
								nextIconButton: {
									sx: {
										color: 'inherit'
									}
								},
								textField: {
									onClick: () => setOpen(true),
									name,
									error: !!fieldState.error,
									InputProps: {
										startAdornment: (
											<InputAdornment
												position="start"
												sx={{
													padding: 0.5
												}}
											>
												<CalendarIcon fontSize="small" />
											</InputAdornment>
										)
									}
								}
							}}
							onClose={() => setOpen(false)}
						/>
					)}
					{fieldState.error && fieldState.error.message ? (
						<FormHelperText error>{fieldState.error.message}</FormHelperText>
					) : null}
				</Stack>
			)}
		/>
	);
};
