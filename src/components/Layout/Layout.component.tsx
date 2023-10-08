import { Outlet } from 'react-router-dom';
import { Header } from 'components/Header';
import { Providers } from 'lib/providers/Providers.provider';
import Container from '@mui/material/Container';

export const Layout = () => {
	return (
		<>
			<Providers>
				<Header />
				<Container maxWidth="md">
					<Outlet />
				</Container>
			</Providers>
		</>
	);
};
