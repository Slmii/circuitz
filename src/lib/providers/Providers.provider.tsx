import { PropsWithChildren } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, ColorModeProvider } from 'lib/context';
import { ReactQueryProvider } from './ReactQuery.provider';
import { ThemeProvider } from './Theme.provider';
import { RecoilRoot } from 'recoil';
import { DatepickerProvider } from './Datepicker.provider';
import { SnackbarProvider } from './Snackbar.provider';

export const Providers = ({ children }: PropsWithChildren) => {
	return (
		<ColorModeProvider>
			<ThemeProvider>
				<ReactQueryProvider>
					<RecoilRoot>
						<SnackbarProvider>
							<AuthProvider>
								<HelmetProvider>
									<DatepickerProvider>{children}</DatepickerProvider>
								</HelmetProvider>
							</AuthProvider>
						</SnackbarProvider>
					</RecoilRoot>
				</ReactQueryProvider>
			</ThemeProvider>
		</ColorModeProvider>
	);
};
