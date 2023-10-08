import { TouchEvent, MouseEvent } from 'react';

export const stopPropagation = ({
	onMouseDown,
	onTouchStart,
	onClick
}: {
	onMouseDown?: (e: MouseEvent) => void;
	onTouchStart?: (e: TouchEvent) => void;
	onClick?: (e: MouseEvent) => void;
}) => {
	return {
		onMouseDown: (e: MouseEvent) => {
			e.stopPropagation();
			onMouseDown && onMouseDown(e);
		},
		onTouchStart: (e: TouchEvent) => {
			e.stopPropagation();
			onTouchStart && onTouchStart(e);
		},
		onClick: (e: MouseEvent) => {
			e.stopPropagation();
			onClick && onClick(e);
		}
	};
};
