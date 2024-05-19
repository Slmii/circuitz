import { Principal } from '@dfinity/principal';
import { FORM_ERRORS } from 'lib/constants';
import * as yup from 'yup';

export const canisterConnectorSchema = yup.object().shape({
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
	})
});
