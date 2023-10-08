/* eslint-disable no-mixed-spaces-and-tabs */
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MuiMenu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React, { useState } from 'react';
import { MenuProps } from './Menu.types';
import Divider from '@mui/material/Divider';
import slugify from 'slugify';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { Icon } from 'components/Icon';

export const Menu = ({
	label,
	id,
	menu,
	fullWidth,
	multiSelect,
	onClose,
	anchorOrigin = {
		vertical: 'bottom',
		horizontal: 'left'
	},
	...rest
}: MenuProps) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [width, setWidth] = useState(0);

	const handleOnMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(e.currentTarget);
		setWidth(e.currentTarget.getBoundingClientRect().width);
	};

	const handleOnMenuClose = (action?: () => void) => {
		action?.();

		// If action defined (MenuItem) and multiSelect is true we keep the Menu open
		if (action && !multiSelect) {
			setAnchorEl(null);
			onClose?.();
		}
		// If there is no action defined, it means this is the onClose of the Menu itself (outside click)
		else if (!action) {
			setAnchorEl(null);
			onClose?.();
		}
	};

	return (
		<>
			{React.cloneElement(typeof label === 'function' ? label(!!anchorEl) : label, {
				onClick: menu
					? // eslint-disable-next-line @typescript-eslint/no-explicit-any
					  (e: any) => {
							(typeof label === 'function' ? label(!!anchorEl) : label).props.onClick?.();
							handleOnMenuOpen(e);
					  }
					: undefined
			})}
			<MuiMenu
				{...rest}
				id={`${slugify(id)}-menu`}
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={() => handleOnMenuClose()}
				anchorOrigin={anchorOrigin}
				slotProps={{
					paper: {
						style: {
							minWidth: fullWidth ? width : undefined
						}
					}
				}}
			>
				{menu.map(({ id, label, icon, image, color, action, disabled, loading, selected }, i) => {
					return [
						<MenuItem
							key={id}
							onClick={() => handleOnMenuClose(action)}
							disabled={disabled || loading}
							selected={selected}
						>
							<>
								{loading ? (
									<CircularProgress
										size={16}
										sx={{
											marginRight: 1
										}}
									/>
								) : icon ? (
									<ListItemIcon>
										<Icon icon={icon} fontSize="small" color="primary" />
									</ListItemIcon>
								) : image ? (
									<ListItemIcon>
										<Box component="img" borderRadius="50%" src={image} alt="" width={20} height={20} />
									</ListItemIcon>
								) : null}
							</>
							<ListItemText
								sx={{
									color: theme => (color ? `${theme.palette[color].main}` : undefined)
								}}
							>
								{label}
							</ListItemText>
						</MenuItem>,
						<Divider key={label} sx={{ margin: '0 !important', display: i !== menu.length - 1 ? 'block' : 'none' }} />
					];
				})}
			</MuiMenu>
		</>
	);
};
