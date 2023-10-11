import { useTheme } from '@mui/material/styles';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColorModeContext } from 'lib/context';
import { Appbar } from 'components/AppBar';
import { useAuth } from 'lib/hooks';
import Box from '@mui/material/Box';
import { Link } from 'components/Link';
import Stack from '@mui/material/Stack';
import { IconButton } from 'components/IconButton';
import { Menu } from 'components/Menu';

export const Header = () => {
	const theme = useTheme();
	const navigate = useNavigate();

	const { toggleColorMode } = useContext(ColorModeContext);
	const { loadingSignOut, user, signOut } = useAuth();

	const colorMode = theme.palette.mode;

	return (
		<Appbar>
			<Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
				<Link href="/">Circuitz</Link>
			</Box>
			<Stack direction="row" spacing={1}>
				<IconButton
					icon={colorMode === 'dark' ? 'moon' : 'sun'}
					tooltip={colorMode === 'dark' ? 'Lights on' : 'Lights off'}
					onClick={toggleColorMode}
					color="primary"
				/>
				{user ? (
					<Menu
						label={<IconButton icon="menu" color="primary" tooltip="Menu" loading={loadingSignOut} />}
						id="profile"
						menu={[
							{
								id: 'circuits',
								label: 'My Circuits',
								icon: 'circuit',
								action: () => navigate('/circuits')
							},
							{
								id: 'settings',
								label: 'Settings',
								icon: 'settings'
							},
							{
								id: 'feedback',
								label: 'Bug/Feedback',
								icon: 'message'
							},
							{
								id: 'signout',
								label: 'Sign Out',
								icon: 'signout',
								action: async () => {
									await signOut();
									navigate('/');
								}
							}
						]}
					/>
				) : null}
			</Stack>
		</Appbar>
	);
};
