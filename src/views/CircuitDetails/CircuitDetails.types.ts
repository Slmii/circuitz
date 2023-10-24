import { NodeSourceType, Node, Trace } from 'lib/types';

export interface CircuitNodeProps {
	isFirst: boolean;
	node?: Node;
	trace?: Trace;
	nested?: boolean;
	onClick: () => void;
}

export interface NodeDialogProps {
	open: boolean;
	type: NodeSourceType;
	node?: Node;
}
