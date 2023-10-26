import { NodeSourceType, Node, Trace } from 'lib/types';

export interface CircuitNodeProps {
	node: Node;
	isFirst: boolean;
	trace?: Trace;
	onNodeSelect: (node: Node) => void;
}

export interface NodeDialogProps {
	open: boolean;
	type: NodeSourceType | 'Unknown';
	node?: Node;
}
