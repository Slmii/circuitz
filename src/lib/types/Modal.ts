import { Connector } from 'declarations/canister.declarations';
import { Pin } from 'declarations/nodes.declarations';
import { ConnectorType } from './Connector';
import { Node } from 'lib/types';

export interface DeletePinModalProps {
	nodeId: number;
	pin: Pin;
}

export interface DeleteNodeModalProps {
	nodeId: number;
}

export interface ConnectorModalProps {
	type: ConnectorType;
	node?: Node;
	connector?: Connector;
}

export type ModalStateProps = DeletePinModalProps | DeleteNodeModalProps | ConnectorModalProps;

export enum ModalTypes {
	DELETE_PIN = 'DELETE_PIN',
	DELETE_NODE = 'DELETE_NODE',
	CONNECTOR = 'CONNECTOR'
}

export type ModalType = keyof typeof ModalTypes;
