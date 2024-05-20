import { Principal } from '@dfinity/principal';
import {
	Authentication,
	ConnectorType as ConnectorTypeOld,
	SignatureMethod,
	TokenLocation
} from 'declarations/canister.declarations';
import { KeysOfUnion } from './Node';

export interface Connector {
	id: number;
	name: string;
	userId: Principal;
	connectorType: ConnectorTypeOld;
	createdAt: Date;
	updatedAt: Date;
}

export type ConnectorType = KeysOfUnion<ConnectorTypeOld>;
export type SignatureMethodType = KeysOfUnion<SignatureMethod>;
export type AuthenticationType = KeysOfUnion<Authentication>;
export type TokenLocationType = KeysOfUnion<TokenLocation>;
