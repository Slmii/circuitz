import { Principal } from '@dfinity/principal';
import { NodeType, Pin } from 'declarations/nodes.declarations';

export interface Node {
	id: number;
	circuitId: number;
	userId: Principal;
	name: string;
	pin: Array<Pin>;
	nodeType: NodeType;
	order: number;
	isFinished: boolean;
	isError: boolean;
	isEnabled: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface NodesList {
	principal: Principal;
	nodes: Array<Node>;
}
