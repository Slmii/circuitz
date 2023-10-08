/* eslint-disable no-mixed-spaces-and-tabs */
import { createTheme, Theme } from '@mui/material/styles';
import React, { PropsWithChildren } from 'react';
import { useLocalStorage } from 'lib/hooks/useLocalStorage';

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
		const theme = createTheme({
			palette: {
				mode,
				...(mode === 'light'
					? {
							// palette values for light mode
							primary: {
								main: '#4A9C7F'
							},
							secondary: {
								main: '#d6ad10'
							}
					  }
					: {
							// palette values for dark mode
							primary: {
								main: '#92cfbc'
							},
							secondary: {
								main: '#e9ea94'
							}
					  })
			},
			typography: {
				fontFamily: '"Roboto", serif',
				fontSize: 16,
				htmlFontSize: 16,
				fontWeightBold: 700,
				fontWeightRegular: 400
			},
			shape: {
				borderRadius: 8
			},
			spacing: 8
		});

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
