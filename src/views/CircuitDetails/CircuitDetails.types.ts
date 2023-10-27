import { NodeSourceType, Node, Trace } from 'lib/types';

export interface CircuitNodeProps {
	node: Node;
	isFirst: boolean;
	index: number;
	trace?: Trace;
	onNodeSelect: (node: Node) => void;
	onMoveNode: (dragIndex: number, hoverIndex: number) => void;
}

export interface NodeDialogProps {
	open: boolean;
	type: NodeSourceType | 'Unknown';
	node?: Node;
}
