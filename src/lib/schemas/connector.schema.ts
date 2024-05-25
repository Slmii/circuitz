import { Principal } from '@dfinity/principal';
import { FORM_ERRORS } from 'lib/constants';
import { AuthenticationType, TokenLocationType } from 'lib/types';
import * as yup from 'yup';

export const canisterConnectorSchema = yup.object().shape({
	name: yup.string().required(FORM_ERRORS.required).max(30, FORM_ERRORS.maxChars(30)),
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

export const httpConnectorSchema = yup.object().shape({
	name: yup.string().required(FORM_ERRORS.required).max(30, FORM_ERRORS.maxChars(30)),
	baseUrl: yup
		.string()
		.matches(
			/((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
			FORM_ERRORS.url
		)
		.required(FORM_ERRORS.url),
	headers: yup
		.array()
		.of(
			yup.object().shape({
				key: yup.string().required(FORM_ERRORS.required),
				value: yup.string().required(FORM_ERRORS.required)
			})
		)
		.min(1, FORM_ERRORS.minSelection(1)),
	authentication: yup.object().shape({
		selected: yup.string().required(FORM_ERRORS.required),
		basic: yup.object().when('selected', {
			is: (selected: AuthenticationType) => selected === 'Basic',
			then: () =>
				yup.object().shape({
					username: yup.string().required(FORM_ERRORS.required),
					password: yup.string().required(FORM_ERRORS.required)
				}),
			otherwise: schema => schema.nullable()
		}),
		token: yup.object().when('selected', {
			is: (selected: AuthenticationType) => selected === 'Token',
			then: () =>
				yup.object().shape({
					token: yup.string().required(FORM_ERRORS.required),
					location: locationSchema
				}),
			otherwise: schema => schema.nullable()
		}),
		jwt: yup.object().when('selected', {
			is: (selected: AuthenticationType) => selected === 'JWT',
			then: () =>
				yup.object().shape({
					signatureMethod: yup.string().required(FORM_ERRORS.required),
					secret: yup.string().required(FORM_ERRORS.required),
					payload: yup.string().required(FORM_ERRORS.required),
					location: locationSchema
				}),
			otherwise: schema => schema.nullable()
		})
	}),
	testConnection: yup.object().shape({
		relativeUrl: yup.string(),
		method: yup.string().required(FORM_ERRORS.required),
		error: yup.object().shape({
			value: yup.string().when('field', {
				is: (field: string) => field.length > 0,
				then: schema => schema.required(FORM_ERRORS.required)
			})
		})
	})
});

const locationSchema = yup.object().shape({
	selected: yup.string().required(FORM_ERRORS.required),
	header: yup.object().when('selected', {
		is: (selected: TokenLocationType) => selected === 'HTTPHeader',
		then: () =>
			yup.object().shape({
				name: yup.string().required(FORM_ERRORS.required),
				scheme: yup.string().required(FORM_ERRORS.required)
			}),
		otherwise: schema => schema.nullable()
	}),
	queryParam: yup.string().when('selected', {
		is: (selected: TokenLocationType) => selected === 'Query',
		then: schema => schema.required(FORM_ERRORS.required),
		otherwise: schema => schema.nullable()
	})
});
