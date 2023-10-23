import { NodeSourceType, Node, Trace } from 'lib/types';

export interface CircuitNodeProps {
	nodeId: number;
	isFirst: boolean;
	trace?: Trace;
	nested?: boolean;
	onClick: () => void;
}

export interface DialogState {
	open: boolean;
	type: NodeSourceType;
	node?: Node;
}
