import { FORM_ERRORS } from 'lib/constants';
import * as yup from 'yup';

export const mapperPinSchema = yup.object().shape({
	inputSampleData: yup.string().required(FORM_ERRORS.required),
	fields: yup
		.array()
		.min(1, FORM_ERRORS.minSelection(1))
		.of(
			yup.object({
				input: yup.string().required(FORM_ERRORS.required),
				output: yup.string().required(FORM_ERRORS.required)
			})
		)
});
