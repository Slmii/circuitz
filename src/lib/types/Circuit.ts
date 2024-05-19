import { Principal } from '@dfinity/principal';
import { KeysOfUnion } from './Node';
import { ConnectorType as ConnectorTypeOld } from 'declarations/canister.declarations';

export interface Circuit {
	id: number;
	userId: Principal;
	nodeCanisterId: Principal;
	name: string;
	description: string;
	isFavorite: boolean;
	isEnabled: boolean;
	runAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

export type ConnectorType = KeysOfUnion<ConnectorTypeOld>;
