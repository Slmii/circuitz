import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { Icon } from 'components/Icon';
import { Controller, useFormContext } from 'react-hook-form';
import { FieldProps, StandaloneFieldProps, UploadFieldProps } from './Field.types';
import Stack from '@mui/material/Stack';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import slugify from 'slugify';
import React from 'react';

export const StandaloneField = React.forwardRef<HTMLInputElement, StandaloneFieldProps>(
	(
		{
			label,
			type = 'text',
			disabled = false,
			required = false,
			placeholder,
			startIcon,
			endIcon,
			endElement,
			fullWidth,
			readOnly = false,
			onChange,
			autoFocus = false,
			helperText,
			multiline = false,
			multilineRows,
			maxLength,
			errorMessage,
			size = 'medium',
			...field
		},
		ref
	) => {
		const labelId = `${slugify(field.name)}-label`;

		return (
			<Stack
				direction="column"
				spacing={0.25}
				sx={{
					position: 'relative',
					width: fullWidth ? '100%' : undefined
				}}
			>
				<TextField
					required={required}
					id={labelId}
					type={type}
					label={label}
					placeholder={placeholder}
					disabled={disabled}
					error={Boolean(errorMessage)}
					fullWidth={fullWidth}
					multiline={multiline}
					rows={multiline && multilineRows ? multilineRows : undefined}
					variant="outlined"
					inputProps={{
						inputMode: type === 'number' ? 'numeric' : undefined,
						pattern: type === 'number' ? '[0-9]*' : undefined,
						maxLength
					}}
					size={size}
					inputRef={ref}
					InputProps={{
						autoFocus,
						sx: {
							paddingRight: theme => (!multiline && maxLength ? `${theme.spacing(3)} !important;` : undefined),
							'& input[type=number]': {
								MozAppearance: 'textfield'
							},
							'& input[type=number]::-webkit-outer-spin-button': {
								WebkitAppearance: 'none',
								margin: 0
							},
							'& input[type=number]::-webkit-inner-spin-button': {
								WebkitAppearance: 'none',
								margin: 0
							}
						},
						readOnly,
						startAdornment: startIcon ? (
							<InputAdornment
								position="start"
								sx={{
									padding: 0.5
								}}
							>
								<Icon icon={startIcon} fontSize="small" />
							</InputAdornment>
						) : null,
						endAdornment: endIcon ? (
							<InputAdornment
								position="end"
								sx={{
									padding: 0.5
								}}
							>
								<Icon icon={endIcon} fontSize="small" />
							</InputAdornment>
						) : endElement ? (
							<InputAdornment position="end">
								{React.cloneElement(endElement, {
									size: 'small',
									fontSize: 'small'
								})}
							</InputAdornment>
						) : null
					}}
					{...field}
					onChange={onChange}
				/>
				{maxLength && (
					<FormHelperText
						sx={{
							position: 'absolute',
							color: 'text.secondary',
							bottom: theme => theme.spacing(errorMessage ? 1.85 : multiline && multilineRows ? 1 : 2.5),
							right: theme => theme.spacing(2)
						}}
					>
						{field.value.length} / {maxLength}
					</FormHelperText>
				)}
				{errorMessage ? <FormHelperText error>{errorMessage}</FormHelperText> : null}
				{helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
			</Stack>
		);
	}
);

export const Field = (props: FieldProps) => {
	return (
		<Controller
			name={props.name}
			rules={{
				required: props.required
			}}
			render={({ field, fieldState }) => (
				<StandaloneField
					{...props}
					{...field}
					errorMessage={fieldState.error?.message}
					onChange={e => {
						field.onChange(props.type === 'number' ? Number(e.target.value) : e.target.value);
						props.onChange?.(e.target.value);
					}}
				/>
			)}
		/>
	);
};

export const UploadField = ({
	name,
	label,
	accept,
	onChange,
	disabled,
	required,
	fullWidth,
	multiple = false
}: UploadFieldProps) => {
	const { setValue } = useFormContext();
	const labelId = `${slugify(name)}-label`;

	return (
		<>
			<Controller
				name={name}
				rules={{
					required
				}}
				render={({ field }) => (
					<FormControl variant="outlined" fullWidth={fullWidth} required={required}>
						<label htmlFor={labelId}>
							<Box display="none">
								<input
									accept={accept}
									id={labelId}
									multiple={multiple}
									type="file"
									name={field.name}
									onChange={e => {
										const files = e.target.files ? Array.from(e.target.files) : [];

										setValue(name, {
											files: files,
											previews: files.map(file => URL.createObjectURL(file))
										});
										onChange?.(files);

										e.target.value = '';
									}}
									disabled={disabled}
								/>
							</Box>
							{label}
						</label>
					</FormControl>
				)}
			/>
		</>
	);
};
