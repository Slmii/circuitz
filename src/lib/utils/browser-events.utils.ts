import { TouchEvent, MouseEvent } from 'react';

export const stopPropagation = (fns?: {
	onMouseDown?: (e: MouseEvent) => void;
	onTouchStart?: (e: TouchEvent) => void;
	onClick?: (e: MouseEvent) => void;
}) => {
	return {
		onMouseDown: (e: MouseEvent) => {
			e.stopPropagation();
			fns?.onMouseDown?.(e);
		},
		onTouchStart: (e: TouchEvent) => {
			e.stopPropagation();
			fns?.onTouchStart?.(e);
		},
		onClick: (e: MouseEvent) => {
			e.stopPropagation();
			fns?.onClick?.(e);
		}
	};
};
