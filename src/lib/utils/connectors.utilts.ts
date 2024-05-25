import type {
	Connector as OldConnector,
	JWTConfig,
	SignatureMethod,
	TokenLocation,
	TokenConfig
} from 'declarations/canister.declarations';
import type { AuthenticationType, Connector, HeaderRequestMethodType, SignatureMethodType } from 'lib/types';
import { dateFromNano } from './date.utils';
import { AuthenticationLocation, CanisterConnectorFormValues, HttpConnectorFormValues } from 'components/NodeDrawers';

export const mapToConnector = (connector: OldConnector): Connector => {
	return {
		id: connector.id,
		userId: connector.user_id,
		name: connector.name,
		connectorType: connector.connector_type,
		createdAt: dateFromNano(connector.created_at),
		updatedAt: dateFromNano(connector.updated_at)
	};
};

/**
 * Get the form values for the Canister connector. If no connector is provided, return the default values.
 */
export const getCanisterConnectorFormValues = (connector?: Connector): CanisterConnectorFormValues => {
	if (!connector || !('Canister' in connector.connectorType)) {
		return {
			name: '',
			canisterId: ''
		};
	}

	return {
		name: connector.name,
		canisterId: connector.connectorType.Canister
	};
};

/**
 * Get the form values for the HTTP connector. If no connector is provided, return the default values.
 */
export const getHttpConnectorFormValues = (connector?: Connector): HttpConnectorFormValues => {
	if (!connector || !('Http' in connector.connectorType)) {
		return {
			name: '',
			baseUrl: '',
			headers: [{ key: 'Content-Type', value: 'application/json' }],
			authentication: {
				selected: 'None',
				basic: {
					username: '',
					password: ''
				},
				token: {
					token: '',
					location: getAuthenticationLocation()
				},
				jwt: {
					signatureMethod: getJWTSignatureMethodType(),
					payload: getJWTPayload(),
					secret: '',
					location: getAuthenticationLocation(),
					inputSampleData: ''
				}
			},
			testConnection: {
				error: {
					field: '',
					value: ''
				},
				method: 'GET',
				relativeUrl: ''
			}
		};
	}

	const httpConnector = connector.connectorType.Http;
	let selected: AuthenticationType = 'None';

	let jwtConfig: JWTConfig | undefined;
	if ('JWT' in httpConnector.authentication) {
		selected = 'JWT';
		jwtConfig = httpConnector.authentication.JWT;
	}

	let tokenConfig: TokenConfig | undefined;
	if ('Token' in httpConnector.authentication) {
		selected = 'Token';
		tokenConfig = httpConnector.authentication.Token;
	}

	let basicAuth: [string, string] | undefined;
	if ('Basic' in httpConnector.authentication) {
		selected = 'Basic';
		basicAuth = httpConnector.authentication.Basic;
	}

	return {
		name: connector.name,
		baseUrl: httpConnector.base_url,
		headers: httpConnector.headers.map(header => ({ key: header[0], value: header[1] })),
		authentication: {
			selected,
			basic: {
				username: basicAuth?.[0] ?? '',
				password: basicAuth?.[1] ?? ''
			},
			token: {
				token: tokenConfig?.token ?? '',
				location: getAuthenticationLocation(tokenConfig?.location)
			},
			jwt: {
				signatureMethod: getJWTSignatureMethodType(jwtConfig?.signature_method),
				payload: getJWTPayload(jwtConfig),
				secret: '',
				location: getAuthenticationLocation(jwtConfig?.location),
				inputSampleData: ''
			}
		},
		testConnection: {
			error: {
				field: httpConnector.test_connection[0]?.error[0]?.[0] ?? '',
				value: httpConnector.test_connection[0]?.error[0]?.[1] ?? ''
			},
			method: (httpConnector.test_connection[0]?.method ?? 'GET') as HeaderRequestMethodType,
			relativeUrl: httpConnector.test_connection[0]?.relative_url ?? ''
		}
	};
};

const getJWTSignatureMethodType = (signatureMethod?: SignatureMethod): SignatureMethodType => {
	if (!signatureMethod) {
		return 'HS256';
	}

	if ('RS256' in signatureMethod) {
		return 'RS256';
	}

	if ('RS384' in signatureMethod) {
		return 'RS384';
	}

	if ('RS512' in signatureMethod) {
		return 'RS512';
	}

	if ('HS256' in signatureMethod) {
		return 'HS256';
	}

	if ('HS384' in signatureMethod) {
		return 'HS384';
	}

	if ('HS512' in signatureMethod) {
		return 'HS512';
	}

	if ('ES256' in signatureMethod) {
		return 'ES256';
	}

	if ('ES384' in signatureMethod) {
		return 'ES384';
	}

	return 'ES512';
};

const getJWTPayload = (jwtConfig?: JWTConfig) => {
	if (!jwtConfig) {
		return `{
	"iss": "", 
	"sub": "", 
	"aud": "", 
	"exp": ""
}`;
	}

	return jwtConfig.payload;
};

const getAuthenticationLocation = (tokenLocation?: TokenLocation): AuthenticationLocation => {
	if (!tokenLocation) {
		return {
			selected: 'HTTPHeader',
			header: {
				name: '',
				scheme: ''
			},
			queryParam: ''
		};
	}

	if ('HTTPHeader' in tokenLocation) {
		return {
			selected: 'HTTPHeader',
			header: {
				name: tokenLocation.HTTPHeader[0],
				scheme: tokenLocation.HTTPHeader[1]
			},
			queryParam: ''
		};
	}

	return {
		selected: 'Query',
		header: {
			name: '',
			scheme: ''
		},
		queryParam: tokenLocation.Query
	};
};
