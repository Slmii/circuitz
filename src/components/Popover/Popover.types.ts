import { PopoverOrigin } from '@mui/material/Popover';

export interface PopoverProps {
	label: JSX.Element | ((open: boolean) => JSX.Element);
	id: string;
	fullWidth?: boolean;
	/**
	 * Playground: https://mui.com/material-ui/react-popover/#anchor-playground
	 */
	anchorOrigin?: PopoverOrigin;
	/**
	 * Playground: https://mui.com/material-ui/react-popover/#anchor-playground
	 */
	transformOrigin?: PopoverOrigin;
	/**
	 * Control the Popover open state from outside
	 */
	open?: boolean;
	/**
	 * Custom event handlers. Usefull for controlling the Popover open state from outside
	 */
	onOpen?: () => void;
	/**
	 * Custom event handlers. Usefull for controlling the Popover open state from outside
	 */
	onClose?: () => void;
}
