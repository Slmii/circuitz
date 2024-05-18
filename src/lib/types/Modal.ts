import { Pin } from 'declarations/nodes.declarations';

export interface DeletePinModalProps {
	nodeId: number;
	pin: Pin;
}

export interface DeleteNodeModalProps {
	nodeId: number;
}

export type ModalStateProps = DeletePinModalProps | DeleteNodeModalProps;

export enum ModalTypes {
	DELETE_PIN = 'DELETE_PIN',
	DELETE_NODE = 'DELETE_NODE'
}

export type ModalType = keyof typeof ModalTypes;
