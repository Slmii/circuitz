import { CSSObject, Components, PaletteOptions, Theme } from '@mui/material/styles';
import { DISABLE_MARGIN_MEDIA_QUERY } from 'lib/constants/theme.constants';

export const DARK_THEME: Readonly<PaletteOptions> = {
	primary: {
		main: '#ffcc28',
		dark: '#e6b500',
		light: '#ffd54f',
		contrastText: '#070607'
	},
	secondary: {
		main: '#9977ff',
		dark: '#7a5fe6',
		light: '#b89aff',
		contrastText: '#FFFFFF'
	},
	success: {
		main: '#41FF76'
	},
	error: {
		main: '#FF4163',
		contrastText: '#FFFFFF'
	},
	warning: {
		main: '#FFAA2A'
	},
	text: {
		primary: '#FFFFFF',
		secondary: 'rgba(255, 255, 255, 0.7)'
	},
	background: {
		default: '#1E1E20',
		paper: 'rgba(7, 6, 7, 0.5)'
	},
	divider: 'rgba(255, 255, 255, 0.08)'
};

export const LIGHT_THEME: Readonly<PaletteOptions> = {
	primary: {
		main: '#ffcc28',
		dark: '#e6b500',
		light: '#ffd54f',
		contrastText: '#070607'
	},
	secondary: {
		main: '#9977ff',
		dark: '#7a5fe6',
		light: '#b89aff',
		contrastText: '#FFFFFF'
	},
	success: {
		main: '#41FF76'
	},
	error: {
		main: '#FF4163',
		contrastText: '#FFFFFF'
	},
	warning: {
		main: '#FFAA2A'
	},
	text: {
		primary: '#FFFFFF',
		secondary: 'rgba(255, 255, 255, 0.7)'
	},
	background: {
		default: '#1E1E20',
		paper: 'rgba(7, 6, 7, 0.5)'
	},
	divider: 'rgba(255, 255, 255, 0.08)'
};

export const components: Readonly<Components<Omit<Theme, 'components'>>> = {
	MuiContainer: {
		styleOverrides: {
			root: {
				'&.MuiContainer-maxWidthMd': {
					maxWidth: 1000,
					[`@media ${DISABLE_MARGIN_MEDIA_QUERY}`]: {
						maxWidth: 'unset'
					}
				}
			}
		}
	},
	MuiSvgIcon: {
		styleOverrides: {
			root: {}
		}
	},
	MuiInputAdornment: {
		styleOverrides: {
			root: {
				color: 'default'
			}
		}
	},
	MuiCssBaseline: {
		styleOverrides: theme => ({
			'&::-webkit-scrollbar': {
				width: '2px',
				height: '2px'
			},
			'&::-webkit-scrollbar-track': {
				borderRadius: '50px',
				background: theme.palette.secondary.main
			},
			'&::-webkit-scrollbar-thumb': {
				backgroundColor: theme.palette.secondary.main,
				borderRadius: '50px'
			},
			bold: {
				fontWeight: theme.typography.fontWeightBold
			},
			b: {
				fontWeight: theme.typography.fontWeightBold
			}
		})
	},
	MuiSelect: {
		styleOverrides: {
			icon: {
				color: 'inherit'
			}
		}
	},
	MuiSkeleton: {
		defaultProps: {
			animation: 'wave'
		}
	},
	MuiDrawer: {
		styleOverrides: {
			root: ({ ownerState, theme }) => ({
				overflow: 'hidden',
				...createDrawerTransition(theme, ownerState.open)
			}),
			paper: ({ ownerState, theme }) => ({
				...createDrawerTransition(theme, ownerState.open)
			})
		}
	},
	MuiIconButton: {
		styleOverrides: {
			root: {
				'&.Mui-disabled': {
					pointerEvents: 'auto'
				}
			}
		}
	},
	MuiButton: {
		styleOverrides: {
			root: {
				textTransform: 'none'
			}
		}
	}
};

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
	// Remove the hash if it's there
	hex = hex.replace(/^#/, '');

	if (hex.length !== 3 && hex.length !== 6) {
		// Invalid hex color
		return null;
	}

	const digits = hex.length / 3;
	const red = parseInt(hex.substring(0, digits), 16);
	const green = parseInt(hex.substring(digits, digits * 2), 16);
	const blue = parseInt(hex.substring(digits * 2, digits * 3), 16);

	if (isNaN(red) || isNaN(green) || isNaN(blue)) {
		// Invalid hex color
		return null;
	}

	return { r: red, g: green, b: blue };
}

export function randomHexColor(): string {
	return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

const createDrawerTransition = (theme: Theme, isOpen: boolean | undefined): CSSObject => ({
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: isOpen ? theme.transitions.duration.leavingScreen : theme.transitions.duration.enteringScreen
	})
});
