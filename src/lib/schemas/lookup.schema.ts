import { Principal } from '@dfinity/principal';
import { FORM_ERRORS } from 'lib/constants';
import { LookCanisterArgType } from 'lib/types';
import * as yup from 'yup';

export const lookupCanisterSchema = yup.object().shape({
	name: yup.string().required(FORM_ERRORS.required),
	canisterId: yup.string().test('is-principal', FORM_ERRORS.canister, value => {
		try {
			if (!value) {
				return false;
			}

			Principal.fromText(value);
			return true;
		} catch (error) {
			return false;
		}
	}),
	inputSampleData: yup.string().required(FORM_ERRORS.required),
	cycles: yup.string().matches(/^[0-9.,]+$/, FORM_ERRORS.numeric),
	methodName: yup.string().required(FORM_ERRORS.selection),
	args: yup.array().of(
		yup.object({
			dataType: yup.string().required(FORM_ERRORS.selection),
			value: yup.string().when('dataType', {
				is: (type: LookCanisterArgType) => type === 'Principal',
				then: schema =>
					schema.test('is-principal', FORM_ERRORS.principal, value => {
						try {
							if (!value) {
								return false;
							}

							Principal.fromText(value);
							return true;
						} catch (error) {
							return false;
						}
					}),
				otherwise: schema => schema.required(FORM_ERRORS.required)
			})
		})
	)
});

export const lookupHttpRequestSchema = yup.object().shape({
	name: yup.string().required(FORM_ERRORS.required),
	inputSampleData: yup.string().required(FORM_ERRORS.required),
	cycles: yup.string().matches(/^[0-9.,]+$/, FORM_ERRORS.numeric),
	method: yup.string().required(FORM_ERRORS.selection),
	url: yup.string().required(FORM_ERRORS.required),
	headers: yup.array().of(
		yup.object({
			key: yup.string().required(FORM_ERRORS.required),
			value: yup.string().required(FORM_ERRORS.required)
		})
	)
});
