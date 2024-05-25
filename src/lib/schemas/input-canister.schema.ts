import { FORM_ERRORS } from 'lib/constants';
import { VerificationType } from 'lib/types';
import * as yup from 'yup';
import { isPrincipalSchema } from './shared.schema';

export const inputCanisterSchema = yup.object().shape({
	name: yup.string().required(FORM_ERRORS.required),
	inputSampleData: yup.string().required(FORM_ERRORS.required),
	verificationType: yup.string().oneOf(['token', 'whitelist', 'none'], 'Invalid verification type'),
	verificationTypeToken: yup.string().when('verificationType', {
		is: (type: VerificationType) => type === 'token',
		then: schema => schema.required(FORM_ERRORS.required)
	}),
	verificationTypeTokenField: yup.string().when('verificationType', {
		is: (type: VerificationType) => type === 'token',
		then: schema => schema.required(FORM_ERRORS.required)
	}),
	verificationTypeWhitelist: yup.array().when('verificationType', {
		is: (type: VerificationType) => type === 'whitelist',
		then: schema =>
			schema.of(
				yup.object().shape({
					principal: isPrincipalSchema
				})
			)
	})
});
