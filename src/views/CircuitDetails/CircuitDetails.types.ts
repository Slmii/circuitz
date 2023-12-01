import { NodeSourceType, Node, Trace } from 'lib/types';

export interface CircuitNodeProps {
	node: Node;
	trace?: Trace;
	onNodeSelect: (node: Node) => void;
	onToggleNodeStatus: (node: Node) => void;
}

export interface NodeDialogProps {
	open: boolean;
	type: NodeSourceType | 'Unknown';
	node?: Node;
}
