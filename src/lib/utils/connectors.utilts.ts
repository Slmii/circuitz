import type { Connector as OldConnector } from 'declarations/canister.declarations';
import type { Connector } from 'lib/types';
import { dateFromNano } from './date.utils';
import { HttpConnectorFormValues } from 'components/NodeDrawers';

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

export const getHttpConnectorFormValues = (): HttpConnectorFormValues => {
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
				location: {
					selected: 'HTTPHeader',
					header: {
						name: '',
						scheme: ''
					},
					queryParam: ''
				}
			},
			jwt: {
				signatureMethod: 'HMACSHA256',
				payload: `{
"iss": "", 
"sub": "", 
"aud": "", 
"exp": ""
}
`,
				secret: '',
				location: {
					selected: 'HTTPHeader',
					header: {
						name: '',
						scheme: ''
					},
					queryParam: ''
				},
				inputSampleData: ''
			}
		},
		testConnection: {
			error: {
				field: '',
				value: ''
			},
			success: {
				field: '',
				value: ''
			},
			method: 'GET',
			relativeUrl: ''
		}
	};
};
