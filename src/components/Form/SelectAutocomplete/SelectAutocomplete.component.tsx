import Autocomplete from '@mui/material/Autocomplete';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import slugify from 'slugify';
import {
	Option,
	SelectAutocompleteMultipleProps,
	SelectAutocompleteSingleProps,
	StandaloneAutocompleteProps
} from './SelectAutocomplete.types';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import Chip from '@mui/material/Chip';
import { Icon } from 'components/Icon';
import { InputAdornment, Popper } from '@mui/material';
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
						{option.label}
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
								{option.label}
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

export const SelectAutocompleteMultiple = ({
	name,
	label,
	options = [],
	onChange,
	helperText,
	placeholder = 'Type to search',
	required,
	disabled,
	fullWidth,
	isOptionsLoading,
	max,
	startIcon,
	endIcon,
	outsideElement
}: SelectAutocompleteMultipleProps) => {
	const { control, setValue: setFormValue, getValues } = useFormContext();
	const [values, setValues] = useState<Option[]>([]);

	useEffect(() => {
		if (options.length > 0) {
			const defaultFormValues = getValues(name) as Option[];

			// Find the options that match the defaultValues in the formContext
			// and prefill those in the input field as a `Chip` tag
			const foundOptions = options.filter(option => defaultFormValues?.find(value => value.id === option.id));
			setValues(foundOptions);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [options]);

	const handleOnDeleteOption = (option: Option) => {
		const newValues = values.filter(value => value.id !== option.id);

		// Set values in the Autocomplete component
		setValues(newValues);

		// Set values in the formContext
		setFormValue(name, newValues);
	};

	return (
		<Controller
			name={name}
			control={control}
			defaultValue={getValues(name)}
			render={({ field, fieldState }) => (
				<Autocomplete
					multiple
					disableCloseOnSelect
					id={`${slugify(name)}-field`}
					value={values}
					options={options}
					isOptionEqualToValue={(option, value) => option.id === value.id}
					getOptionLabel={option => option.label}
					groupBy={option => option.groupBy ?? ''}
					disabled={disabled}
					renderTags={() => null}
					fullWidth={fullWidth}
					disableClearable
					popupIcon={<Icon icon="search" fontSize="small" />}
					renderOption={(props, option) => {
						return (
							<li {...props} key={option.id} aria-disabled={max ? values.length === max : undefined}>
								{option.label}
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
									variant="outlined"
									error={Boolean(fieldState.error)}
									name={name}
									placeholder={placeholder}
									label={label}
									required={required}
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
									inputProps={{
										...params.inputProps,
										autoComplete: 'new-password' // disable autocomplete and autofill
									}}
								/>
								{!!outsideElement && outsideElement}
							</Stack>
							{fieldState.error && fieldState.error.message ? (
								<FormHelperText error>{fieldState.error.message}</FormHelperText>
							) : null}
							{helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
							{values.length ? (
								<Stack
									direction="row"
									useFlexGap
									flexWrap="wrap"
									spacing={0.5}
									sx={{ mt: theme => `${theme.spacing(0.5)} !important;`, color: 'white' }}
								>
									{values.map((option: Option) => (
										<Chip
											onDelete={() => handleOnDeleteOption(option)}
											key={option.id}
											size="small"
											label={option.label}
											deleteIcon={<Icon icon="close-linear" />}
										/>
									))}
								</Stack>
							) : null}
						</Stack>
					)}
					onChange={(_e, values) => {
						// Execute custom onChange passed as a prop
						onChange?.(values);
						// Set value in the Autocomplete component
						setValues(values);
						// Set value in the formContext
						setFormValue(name, values);
					}}
					onBlur={field.onBlur}
					onInputChange={(_e, value) => {
						if (!value) {
							// If no value if provided then pass an empty array to the custom onChange
							onChange?.([]);
						}
					}}
				/>
			)}
		/>
	);
};
