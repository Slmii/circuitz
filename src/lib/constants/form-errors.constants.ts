import pluralize from 'pluralize';

export const FORM_ERRORS = {
	required: 'Please fill out this field',
	minChars: (min: number) => `Please provide at least ${min} characters`,
	maxChars: (min: number) => `Please provide at most ${min} characters`,
	file: 'Please provide a file',
	image: 'Please provide an image',
	minSelection: (min: number) => `Please select at least ${min} ${pluralize('option', min)}`,
	maxSelection: (max: number) => `Please select at most ${max} ${pluralize('option', max)}`,
	selection: 'Please select an option',
	alphaNumeric: 'Please provide an alphanumeric value',
	numeric: 'Please provide a numeric value',
	url: 'Please provide a valid URL',
	minDate: 'Please provide a date in the future',
	principal: 'Please provide a valid Principal ID',
	canister: 'Please provide a valid Canister ID'
};
