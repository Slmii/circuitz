import { Trace, Node } from 'lib/types';

export interface NodesProps {
	nodes: Node[];
	onNodeClick: (node: Node) => void;
}

export interface NodeProps {
	node: Node;
	isFirst: boolean;
	isLast: boolean;
	trace?: Trace;
	onNodeClick: (node: Node) => void;
}
