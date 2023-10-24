import { CSSObject, Components, PaletteOptions, Theme } from '@mui/material/styles';
import { DISABLE_MARGIN_MEDIA_QUERY } from 'lib/constants';

export const DARK_THEME: Readonly<PaletteOptions> = {
	primary: {
		main: '#D4AF37' // Gold, reminiscent of golden circuit connectors
	},
	secondary: {
		main: '#6d7ce5' // Saddle Brown, like the color of old resistors or wooden radio casings
	},
	success: {
		main: '#32CD32' // Lime Green, like the old LED indicators
	},
	error: {
		main: '#FF6347', // Firebrick, a strong red indicating error
		contrastText: '#FFFFFF'
	},
	warning: {
		main: '#FFD700' // Goldenrod, a warning yellow that's not too bright
	},
	text: {
		primary: '#E6E6E6', // A soft white for better readability
		secondary: 'rgba(230, 230, 230, 0.8)'
	},
	background: {
		default: '#3C3C3C', // A slightly lighter black for the background
		paper: '#2E2E2E' // A semi-transparent version of the background color
	},
	divider: 'rgba(230, 230, 230, 0.3)' // A soft white divider with some transparency
};

export const LIGHT_THEME: Readonly<PaletteOptions> = {
	primary: {
		main: '#D4AF37'
	},
	secondary: {
		main: '#6d7ce5'
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
		default: '#f3f4f6',
		paper: '#FFFFFF'
	},
	divider: 'rgba(0, 0, 0, 0.3)'
};

export const components: Readonly<Components<Omit<Theme, 'components'>>> = {
	MuiTypography: {
		styleOverrides: {
			root: {
				lineHeight: 1.2
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
	MuiInputAdornment: {
		styleOverrides: {
			root: {
				color: 'default'
			}
		}
	},
	MuiCssBaseline: {
		styleOverrides: theme => ({
			bold: {
				fontWeight: theme.typography.fontWeightBold
			},
			b: {
				fontWeight: theme.typography.fontWeightBold
			},
			code: {
				backgroundColor: theme.palette.secondary.main,
				color: theme.palette.secondary.contrastText
			},
			pre: {
				backgroundColor: theme.palette.secondary.main,
				color: theme.palette.secondary.contrastText,
				padding: theme.spacing(2),
				borderRadius: theme.shape.borderRadius,
				overflowX: 'auto'
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
				minHeight: 24,
				padding: '2px 12px'
			}
		}
	},
	MuiFormHelperText: {
		styleOverrides: {
			root: ({ theme }) => ({
				marginTop: `${theme.spacing(1)} !important`
			})
		}
	},
	MuiInputBase: {
		styleOverrides: {
			root: ({ theme }) => ({
				backgroundColor: theme.palette.background.default,
				fieldset: {
					borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
					borderWidth: 1
				}
			})
		}
	},
	MuiDialogTitle: {
		styleOverrides: {
			root: ({ theme }) => ({
				fontSize: 20,
				fontWeight: theme.typography.fontWeightBold
			})
		}
	},
	MuiDialogContent: {
		styleOverrides: {
			root: ({ theme }) => ({
				padding: theme.spacing(3)
			})
		}
	},
	MuiDialogActions: {
		styleOverrides: {
			root: ({ theme }) => ({
				padding: theme.spacing(3)
			})
		}
	},
	MuiLink: {
		defaultProps: {
			underline: 'hover'
		},
		styleOverrides: {
			root: ({ theme }) => ({
				'&:hover': {
					color: theme.palette.primary.main
				}
			})
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
