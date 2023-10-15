import { Principal } from '@dfinity/principal';
import { Arg, NodeType, Pin } from 'declarations/nodes.declarations';

export interface Node {
	id: number;
	circuitId: number;
	userId: Principal;
	pin: Array<Pin>;
	nodeType: NodeType;
	order: number;
	isRunning: boolean;
	isError: boolean;
	isEnabled: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export type VerificationType = 'token' | 'whitelist' | 'none';

export interface NodeSource {
	id: NodeSourceType;
	label: string;
	icon: string;
	disabled: boolean;
}

type KeysOfUnion<T> = T extends T ? keyof T : never;
type NodeTypeKey = KeysOfUnion<NodeType>;
type ArgTypeKey = KeysOfUnion<Arg>;

export type NodeSourceType = NodeTypeKey;
export type LookCanisterArgType = ArgTypeKey;
