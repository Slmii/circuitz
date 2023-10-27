import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core';

interface DragItem {
	index: number;
	id: string;
	type: string;
}

const ItemTypes = {
	NODE: 'node'
};

export const useDraggable = (index: number, onMove: (dragIndex: number, hoverIndex: number) => void) => {
	const dragRef = useRef<HTMLDivElement>(null);
	const previewRef = useRef<HTMLDivElement>(null);

	const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
		accept: ItemTypes.NODE,
		collect(monitor) {
			return {
				handlerId: monitor.getHandlerId()
			};
		},
		hover(item: DragItem, monitor) {
			if (!previewRef.current) {
				return;
			}

			const dragIndex = item.index;
			const hoverIndex = index;

			// Don't replace items with themselves or with the first node
			if (hoverIndex === 0 || dragIndex === hoverIndex) {
				return;
			}

			// Determine rectangle on screen
			const hoverBoundingRect = previewRef.current?.getBoundingClientRect();

			// Get vertical middle
			const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

			// Determine mouse position
			const clientOffset = monitor.getClientOffset();

			// Get pixels to the top
			const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

			// Only perform the move when the mouse has crossed half of the items height
			// When dragging downwards, only move when the cursor is below 50%
			// When dragging upwards, only move when the cursor is above 50%

			// Dragging downwards
			if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
				return;
			}

			// Dragging upwards
			if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
				return;
			}

			// Time to actually perform the action
			onMove(dragIndex, hoverIndex);

			// Note: we're mutating the monitor item here!
			// Generally it's better to avoid mutations,
			// but it's good here for the sake of performance
			// to avoid expensive index searches.
			item.index = hoverIndex;
		}
	});

	const [{ opacity }, drag, preview] = useDrag({
		type: ItemTypes.NODE,
		item: () => {
			return { index };
		},
		collect: monitor => ({
			isDragging: monitor.isDragging(),
			opacity: monitor.isDragging() ? 0.5 : 1
		})
	});

	drag(dragRef);
	drop(preview(previewRef));

	return {
		previewRef,
		dragRef,
		handlerId,
		opacity
	};
};
