import { Pin } from 'declarations/canister.declarations';

export interface DeletePinModalProps {
	nodeId: number;
	pin: Pin;
}

export type ModalStateProps = DeletePinModalProps;

export enum ModalTypes {
	DELETE_PIN = 'DELETE_PIN'
}

export type ModalType = keyof typeof ModalTypes;
