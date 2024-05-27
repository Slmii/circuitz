import Autocomplete from '@mui/material/Autocomplete';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import slugify from 'slugify';
import { Option, SelectAutocompleteSingleProps, StandaloneAutocompleteProps } from './SelectAutocomplete.types';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import { Icon } from 'components/Icon';
import { InputAdornment, ListItemText, Popper } from '@mui/material';
import { CircularProgress } from 'components/Progress';

export const StandaloneAutocomplete = ({
	name,
	onChange,
	options,
	value,
	disabled,
	error,
	fullWidth,
	helperText,
	label,
	placeholder,
	required,
	isOptionsLoading,
	outsideElement,
	endIcon,
	startIcon
}: StandaloneAutocompleteProps) => {
	const [inputValue, setInputValue] = useState('');

	return (
		<Autocomplete
			value={value}
			clearOnBlur
			inputValue={inputValue}
			id={`${slugify(name)}-field`}
			options={options}
			disabled={disabled}
			groupBy={option => option.groupBy ?? ''}
			getOptionLabel={option => option.label}
			isOptionEqualToValue={(option, value) => option.id === value.id}
			fullWidth={fullWidth}
			renderOption={(props, option) => {
				return (
					<li {...props} key={option.id}>
						<ListItemText primary={option.label} />
					</li>
				);
			}}
			renderInput={params => (
				<Stack
					direction="column"
					spacing={0.25}
					sx={{
						position: 'relative',
						width: fullWidth ? '100%' : undefined
					}}
				>
					<Stack direction="row" alignItems="center" spacing={1}>
						<TextField
							{...params}
							placeholder={placeholder}
							variant="outlined"
							error={Boolean(error)}
							name={name}
							label={label}
							required={required}
							inputProps={{
								...params.inputProps,
								autoComplete: 'new-password' // disable autocomplete and autofill
							}}
							InputProps={{
								...params.InputProps,
								startAdornment: startIcon ? (
									<>
										{params.InputProps?.startAdornment}
										<InputAdornment
											position="start"
											sx={{
												padding: 0.5
											}}
										>
											<Icon icon={startIcon} fontSize="small" />
										</InputAdornment>
									</>
								) : null,
								endAdornment: isOptionsLoading ? (
									<CircularProgress />
								) : endIcon ? (
									<>
										<InputAdornment
											position="end"
											sx={{
												padding: 0.5
											}}
										>
											<Icon icon={endIcon} fontSize="small" />
										</InputAdornment>
										{params.InputProps?.endAdornment}
									</>
								) : (
									params.InputProps?.endAdornment
								)
							}}
						/>
						{!!outsideElement && outsideElement}
					</Stack>
					{error ? <FormHelperText error>{error}</FormHelperText> : null}
					{helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
				</Stack>
			)}
			onChange={(_e, value) => {
				onChange(value);
			}}
			onInputChange={(_e, value) => {
				setInputValue(value);

				if (!value) {
					// If no value if provided then pass a null value to the custom onChange
					onChange(null);
				}
			}}
		/>
	);
};

export const SelectAutocomplete = ({
	name,
	label,
	options = [],
	onChange,
	required,
	disabled,
	placeholder = 'Type to search',
	helperText,
	fullWidth,
	isOptionsLoading,
	outsideElement,
	endIcon,
	startIcon
}: SelectAutocompleteSingleProps) => {
	const { setValue: setFormValue, getValues } = useFormContext();

	const [value, setValue] = useState<Option | null>(null);
	const [inputValue, setInputValue] = useState('');

	useEffect(() => {
		if (options.length > 0) {
			const defaultFormValue = getValues(name) as null | string;

			// Find the option that match the given defaultvalue in the formContext
			const option = options.find(option => option.id === defaultFormValue);

			if (typeof option !== 'undefined') {
				// Set the option as the selected option
				setValue(option);

				// Set the selected option's name value in the input field
				setInputValue(option.label);
			} else {
				setValue(null);
				setInputValue('');
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [options]);

	return (
		<Controller
			name={name}
			rules={{
				required
			}}
			render={({ field, fieldState }) => (
				<Autocomplete
					value={value}
					clearOnBlur
					inputValue={inputValue}
					id={`${slugify(name)}-field`}
					options={options}
					disabled={disabled}
					groupBy={option => option.groupBy ?? ''}
					getOptionLabel={option => option.label}
					isOptionEqualToValue={(option, value) => option.id === value.id}
					fullWidth={fullWidth}
					PopperComponent={props => <Popper {...props} placement="bottom-start" />}
					slotProps={
						fullWidth
							? {
									popper: {
										style: {
											width: 'fit-content'
										}
									}
							  }
							: undefined
					}
					renderOption={(props, option) => {
						return (
							<li {...props} key={option.id}>
								<ListItemText primary={option.label} />
							</li>
						);
					}}
					renderInput={params => (
						<Stack
							direction="column"
							spacing={0.25}
							sx={{
								position: 'relative',
								width: fullWidth ? '100%' : undefined
							}}
						>
							<Stack direction="row" alignItems="center" spacing={1}>
								<TextField
									{...params}
									placeholder={placeholder}
									variant="outlined"
									error={Boolean(fieldState.error)}
									name={name}
									label={label}
									required={required}
									inputProps={{
										...params.inputProps,
										autoComplete: 'new-password' // disable autocomplete and autofill
									}}
									InputProps={{
										...params.InputProps,
										startAdornment: startIcon ? (
											<>
												{params.InputProps?.startAdornment}
												<InputAdornment
													position="start"
													sx={{
														padding: 0.5
													}}
												>
													<Icon icon={startIcon} fontSize="small" />
												</InputAdornment>
											</>
										) : (
											params.InputProps?.startAdornment
										),
										endAdornment: isOptionsLoading ? (
											<CircularProgress />
										) : endIcon ? (
											<>
												<InputAdornment
													position="end"
													sx={{
														padding: 0.5
													}}
												>
													<Icon icon={endIcon} fontSize="small" />
												</InputAdornment>
												{params.InputProps?.endAdornment}
											</>
										) : (
											params.InputProps?.endAdornment
										)
									}}
								/>
								{!!outsideElement && outsideElement}
							</Stack>
							{fieldState.error && fieldState.error.message ? (
								<FormHelperText error>{fieldState.error.message}</FormHelperText>
							) : null}
							{helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
						</Stack>
					)}
					onChange={(_e, value) => {
						// Execute custom onChange passed as a prop
						onChange?.(value);
						// Set value in the Autocomplete component
						setValue(value);
						// Set value in the formContext
						setFormValue(name, value ? value.id : value);
					}}
					onBlur={field.onBlur}
					onInputChange={(_e, value) => {
						setInputValue(value);
						if (!value) {
							// If no value if provided then pass a null value to the custom onChange
							onChange?.(null);
						}
					}}
				/>
			)}
		/>
	);
};
