import { DropTargetMonitor } from 'react-dnd';

export interface OnMoveProps {
	dragIndex: number;
	hoverIndex: number;
	monitor: DropTargetMonitor;
}
