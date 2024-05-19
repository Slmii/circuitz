import { Principal } from '@dfinity/principal';
import { ConnectorType } from 'declarations/canister.declarations';

export interface Connector {
	id: number;
	name: string;
	userId: Principal;
	connectorType: ConnectorType;
	createdAt: Date;
	updatedAt: Date;
}
