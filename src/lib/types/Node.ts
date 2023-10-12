import { Principal } from '@dfinity/principal';
import { NodeType, Pin } from 'declarations/nodes.declarations';

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
