import { Principal } from '@dfinity/principal';
import { FORM_ERRORS } from 'lib/constants';
import * as yup from 'yup';

export const isPrincipalSchema = yup.string().test('is-principal', FORM_ERRORS.principal, value => {
	try {
		if (!value) {
			return false;
		}

		Principal.fromText(value);
		return true;
	} catch (error) {
		return false;
	}
});
