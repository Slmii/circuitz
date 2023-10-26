import { Outlet, useLocation } from 'react-router-dom';
import { Header } from 'components/Header';
import { Providers } from 'lib/providers/Providers.provider';
import Container from '@mui/material/Container';
import { useMemo } from 'react';

export const Layout = () => {
	const { pathname } = useLocation();

	const isCircuitsDetailsPage = useMemo(() => {
		return pathname.includes('/circuits/');
	}, [pathname]);

	return (
		<>
			<Providers>
				<Header />
				<Container
					maxWidth={isCircuitsDetailsPage ? false : 'md'}
					sx={{
						padding: isCircuitsDetailsPage ? '0 !important' : undefined
					}}
				>
					<Outlet />
				</Container>
			</Providers>
		</>
	);
};
