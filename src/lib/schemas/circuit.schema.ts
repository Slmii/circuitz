import { FORM_ERRORS } from 'lib/constants';
import * as yup from 'yup';

export const circuitSchema = yup.object().shape({
	name: yup.string().required(FORM_ERRORS.required)
});
