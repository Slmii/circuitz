import React, { PropsWithChildren, useEffect, useState } from 'react';
import { PopoverProps } from './Popover.types';
import slugify from 'slugify';
import MuiPopover from '@mui/material/Popover';

export const Popover = ({
	label,
	id,
	fullWidth,
	anchorOrigin = {
		vertical: 'bottom',
		horizontal: 'left'
	},
	transformOrigin = {
		vertical: 'top',
		horizontal: 'left'
	},
	open,
	children,
	onClose,
	onOpen
}: PropsWithChildren<PopoverProps>) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [width, setWidth] = useState(0);

	useEffect(() => {
		// Close the popover if the open prop is set to false
		// This is to allow the popover to be controlled from outside
		if (typeof open !== 'undefined' && !open) {
			setAnchorEl(null);
		}
	}, [open]);

	const handleOnMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(e.currentTarget);
		setWidth(e.currentTarget.getBoundingClientRect().width);
		onOpen?.();
	};

	const handleOnClose = () => {
		setAnchorEl(null);
		onClose?.();
	};

	return (
		<>
			{React.cloneElement(typeof label === 'function' ? label(!!anchorEl) : label, {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				onClick: (e: any) => {
					(typeof label === 'function' ? label(!!anchorEl) : label).props.onClick?.();
					handleOnMenuOpen(e);
				}
			})}
			<MuiPopover
				id={`${slugify(id)}-menu`}
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={() => handleOnClose()}
				anchorOrigin={anchorOrigin}
				transformOrigin={transformOrigin}
				slotProps={{
					paper: {
						style: {
							minWidth: fullWidth ? width : undefined
						}
					}
				}}
			>
				{children}
			</MuiPopover>
		</>
	);
};
