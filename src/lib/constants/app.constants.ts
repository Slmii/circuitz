import { Option } from 'components/Form/Select';
import { AuthenticationType, ConnectorType, SignatureMethodType, TokenLocationType } from 'lib/types';
import { HeaderRequestMethodType, LookCanisterArgType } from 'lib/types';

export const APPLICATION_OPTIONS: Option<ConnectorType>[] = [
	{
		id: 'Canister',
		label: 'Canister',
		icon: 'infinite'
	},
	{
		id: 'Http',
		label: 'HTTP',
		icon: 'request'
	}
];

export const APPLICATION_AUTHENTICATION_OPTIONS: Option<AuthenticationType>[] = [
	{
		id: 'None',
		label: 'None'
	},
	{
		id: 'Basic',
		label: 'Basic'
	},
	{
		id: 'Token',
		label: 'Token'
	},
	{
		id: 'JWT',
		label: 'JWT'
	}
];

export const APPLICATION_AUTHENTICATION_LOCATION_OPTIONS: Option<TokenLocationType>[] = [
	{
		id: 'HTTPHeader',
		label: 'HTTP Header'
	},
	{
		id: 'Query',
		label: 'Query Param'
	}
];

export const JWT_SIGNATURE_OPTIONS: Option<SignatureMethodType>[] = [
	{
		id: 'HS256',
		label: 'HMACSHA256'
	},
	{
		id: 'HS384',
		label: 'HMACSHA384'
	},
	{
		id: 'HS512',
		label: 'HMACSHA512'
	},
	{
		id: 'RS256',
		label: 'RSASHA256'
	},
	{
		id: 'RS384',
		label: 'RSASHA384'
	},
	{
		id: 'RS512',
		label: 'RSASHA512'
	},
	{
		id: 'ES256',
		label: 'ECDSASHA256'
	},
	{
		id: 'ES384',
		label: 'ECDSASHA384'
	},
	{
		id: 'ES512',
		label: 'ECDSASHA512'
	}
];

export const HTTP_METHODS: HeaderRequestMethodType[] = ['GET', 'POST', 'DELETE', 'PUT'];

export const DATA_TYPES: LookCanisterArgType[] = [
	'String',
	'Number',
	'BigInt',
	'Boolean',
	'Principal',
	'Array',
	'Object'
];
