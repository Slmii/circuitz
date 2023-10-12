import { Outlet, useLocation } from 'react-router-dom';
import { Header } from 'components/Header';
import { Providers } from 'lib/providers/Providers.provider';
import Container from '@mui/material/Container';
import { useMemo } from 'react';

export const Layout = () => {
	const { pathname } = useLocation();

	const isNodesPage = useMemo(() => {
		return pathname.includes('/circuits/');
	}, [pathname]);

	return (
		<>
			<Providers>
				<Header />
				<Container
					maxWidth={isNodesPage ? false : 'md'}
					sx={{
						padding: isNodesPage ? '0 !important' : undefined
					}}
				>
					<Outlet />
				</Container>
			</Providers>
		</>
	);
};
