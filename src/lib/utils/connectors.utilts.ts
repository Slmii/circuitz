import type { Connector as OldConnector } from 'declarations/canister.declarations';
import type { Connector } from 'lib/types';
import { dateFromNano } from './date.utils';

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
