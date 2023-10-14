import { Principal } from '@dfinity/principal';
import { FORM_ERRORS } from 'lib/constants/form-errors.constants';
import { VerificationType } from 'lib/types';
import * as yup from 'yup';

export const inputCanisterSchema = yup.object().shape({
	name: yup.string().required(FORM_ERRORS.required),
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
					principal: yup.string().test('is-principal', FORM_ERRORS.canister, value => {
						try {
							if (!value) {
								return false;
							}

							Principal.fromText(value);
							return true;
						} catch (error) {
							return false;
						}
					})
				})
			)
	})
});
