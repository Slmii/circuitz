import { Principal } from '@dfinity/principal';
import { NodeType, Pin } from 'declarations/nodes.declarations';

export interface Node {
	id: number;
	circuitId: number;
	userId: Principal;
	pin: Array<Pin>;
	nodeType: NodeType;
	order: number;
	isFinished: boolean;
	isError: boolean;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface NodesList {
	principal: Principal;
	nodes: Array<Node>;
}
