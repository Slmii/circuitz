import { CSSObject, Components, PaletteOptions, Theme } from '@mui/material/styles';
import { DISABLE_MARGIN_MEDIA_QUERY } from 'lib/constants/theme.constants';

export const DARK_THEME: Readonly<PaletteOptions> = {
	primary: {
		main: '#ffcc28'
	},
	secondary: {
		main: '#7a8aff'
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
		paper: 'rgba(7, 6, 7)'
	},
	divider: 'rgba(255, 255, 255, 0.3)'
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
		primary: '#00000',
		secondary: 'rgba(0, 0, 0, 0.7)'
	},
	background: {
		default: '#FFFFFF',
		paper: '#f3f4f6'
	},
	divider: 'rgba(0, 0, 0, 0.3)'
};

export const components: Readonly<Components<Omit<Theme, 'components'>>> = {
	MuiTypography: {
		styleOverrides: {
			root: {
				lineHeight: 1.1
			}
		},
		variants: [
			{
				props: { variant: 'h1' } /* component props */,
				style: {
					/* your style here: */
					fontSize: 40
				}
			},
			{
				props: { variant: 'h2' } /* component props */,
				style: {
					/* your style here: */
					fontSize: 32
				}
			},
			{
				props: { variant: 'h3' } /* component props */,
				style: {
					/* your style here: */
					fontSize: 26
				}
			},
			{
				props: { variant: 'h4' } /* component props */,
				style: {
					/* your style here: */
					fontSize: 22
				}
			},
			{
				props: { variant: 'h5' } /* component props */,
				style: {
					/* your style here: */
					fontSize: 18
				}
			},
			{
				props: { variant: 'h6' } /* component props */,
				style: {
					/* your style here: */
					fontSize: 16
				}
			},
			{
				props: { variant: 'body1' } /* component props */,
				style: {
					/* your style here: */
					fontSize: 16
				}
			},
			{
				props: { variant: 'body2' } /* component props */,
				style: {
					/* your style here: */
					fontSize: 14
				}
			},
			{
				props: { variant: 'caption' } /* component props */,
				style: {
					/* your style here: */
					fontSize: 12
				}
			}
		]
	},
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
	MuiTabs: {
		styleOverrides: {
			root: ({ theme }) => ({
				'& .MuiTabs-flexContainer': {
					gap: theme.spacing(2)
				}
			})
		}
	},
	MuiTab: {
		styleOverrides: {
			root: {
				textTransform: 'none',
				minWidth: 0,
				paddingLeft: 0,
				paddingRight: 0
			}
		}
	},
	MuiButton: {
		styleOverrides: {
			root: {
				textTransform: 'none'
			},
			sizeLarge: {
				minHeight: 40,
				padding: '10px 24px'
			},
			sizeMedium: {
				minHeight: 32,
				padding: '6px 20px'
			},
			sizeSmall: {
				minHeight: 60,
				padding: '2px 12px'
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
