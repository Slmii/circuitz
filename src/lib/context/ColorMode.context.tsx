/* eslint-disable no-mixed-spaces-and-tabs */
import { createTheme, responsiveFontSizes, Theme } from '@mui/material/styles';
import React, { PropsWithChildren } from 'react';
import { useLocalStorage } from 'lib/hooks';
import { components, LIGHT_THEME, DARK_THEME } from 'lib/utils/theme.utils';

interface ColorModeContextInterface {
	theme: Theme;
	toggleColorMode: () => void;
}

export const ColorModeContext = React.createContext<ColorModeContextInterface>({
	theme: {} as Theme,
	toggleColorMode: () => {}
});

export type ColorMode = 'light' | 'dark';

export const ColorModeProvider = ({ children }: PropsWithChildren) => {
	const [mode, setMode] = useLocalStorage<ColorMode>('colorMode', 'dark');

	const { toggleColorMode } = React.useMemo(
		() => ({
			toggleColorMode: () => {
				setMode(mode === 'light' ? 'dark' : 'light');
			}
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[mode]
	);

	const colorModeTheme = React.useMemo(() => {
		let theme = createTheme({
			palette: {
				mode,
				...(mode === 'light' ? LIGHT_THEME : DARK_THEME)
			},
			typography: {
				fontFamily: '"Orbitron", serif',
				fontSize: 16,
				htmlFontSize: 16,
				fontWeightBold: 700,
				fontWeightRegular: 400
			},
			shape: {
				borderRadius: 8
			},
			spacing: 8,
			components
		});

		theme = responsiveFontSizes(theme);

		// Set color mode on body
		const body = document.querySelector('body');
		if (body) {
			// color attribute
			body.setAttribute('color-mode', mode);
		}

		return theme;
	}, [mode]);

	return (
		<ColorModeContext.Provider
			value={{
				theme: colorModeTheme,
				toggleColorMode
			}}
		>
			{children}
		</ColorModeContext.Provider>
	);
};
