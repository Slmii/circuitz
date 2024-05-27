import FormHelperText from '@mui/material/FormHelperText';
import MenuItem from '@mui/material/MenuItem';
import MuiSelect from '@mui/material/Select';
import { Controller } from 'react-hook-form';
import slugify from 'slugify';
import { SelectProps, StandaloneSelectProps } from './Select.types';
import Box from '@mui/material/Box';
import React from 'react';
import { FormControl, InputAdornment, InputLabel, ListItemIcon, ListItemText } from '@mui/material';
import { Icon } from 'components/Icon';

export const StandaloneSelect = React.forwardRef<HTMLInputElement, StandaloneSelectProps>(
	(
		{
			name,
			value,
			error,
			label,
			options = [],
			onChange,
			required,
			fullWidth,
			disabled = false,
			helperText,
			placeholder = 'Choose an option',
			customLabel,
			startIcon,
			endIcon,
			endElement
		},
		ref
	) => {
		const labelId = `${slugify(name)}-label`;

		return (
			<FormControl disabled={disabled} fullWidth={fullWidth}>
				{label && (
					<InputLabel error={Boolean(error)} id={labelId}>
						{label}
					</InputLabel>
				)}
				<MuiSelect
					required={required}
					label={label}
					error={Boolean(error)}
					MenuProps={{
						anchorOrigin: {
							vertical: 'bottom',
							horizontal: 'left'
						},
						transformOrigin: {
							vertical: 'top',
							horizontal: 'left'
						}
					}}
					id={labelId}
					placeholder={placeholder}
					disabled={disabled}
					variant="outlined"
					fullWidth={fullWidth}
					name={name}
					value={value}
					onChange={onChange}
					inputRef={ref}
					startAdornment={
						startIcon ? (
							<InputAdornment
								position="start"
								sx={{
									padding: 0.5
								}}
							>
								<Icon icon={startIcon} fontSize="small" />
							</InputAdornment>
						) : null
					}
					endAdornment={
						endIcon ? (
							<InputAdornment
								position="end"
								sx={{
									mr: 2,
									padding: 0.5
								}}
							>
								<Icon icon={endIcon} fontSize="small" />
							</InputAdornment>
						) : endElement ? (
							<InputAdornment
								position="end"
								sx={{
									mr: 3
								}}
							>
								{endElement}
							</InputAdornment>
						) : null
					}
					renderValue={value => {
						if (!value) {
							return (
								<Box component="span" sx={{ color: theme => theme.palette.text.secondary }}>
									{placeholder}
								</Box>
							);
						}

						const option = options.find(option => option.id === value);

						if (customLabel && option) {
							return customLabel(option);
						}

						return option?.label;
					}}
				>
					{options.map(option => (
						<MenuItem key={option.id} value={option.id} disabled={option.disabled}>
							{option.icon && (
								<ListItemIcon>
									<Icon icon={option.icon} sx={{ fontSize: 20 }} />
								</ListItemIcon>
							)}
							<ListItemText primary={option.label} />
						</MenuItem>
					))}
				</MuiSelect>
				{error ? <FormHelperText error>{error}</FormHelperText> : null}
				{helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
			</FormControl>
		);
	}
);

export const Select = (props: SelectProps) => {
	return (
		<Controller
			name={props.name}
			rules={{
				required: props.required
			}}
			render={({ field, fieldState }) => {
				return (
					<StandaloneSelect
						{...props}
						{...field}
						error={fieldState.error?.message}
						onChange={e => {
							field.onChange(e);
							props.onChange?.(e.target.value as string);
						}}
					/>
				);
			}}
		/>
	);
};
