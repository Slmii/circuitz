import { Pin } from 'declarations/nodes.declarations';

export interface DeletePinModalProps {
	nodeId: number;
	pin: Pin;
}

export type ModalStateProps = DeletePinModalProps;

export enum ModalTypes {
	DELETE_PIN = 'DELETE_PIN'
}

export type ModalType = keyof typeof ModalTypes;
