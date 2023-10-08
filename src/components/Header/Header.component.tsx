import { useTheme } from '@mui/material/styles';
import { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColorModeContext } from 'lib/context';
import { Appbar } from 'components/AppBar';
import { useAuth, useCopyToClipboard } from 'lib/hooks';
import Box from '@mui/material/Box';
import { Link } from 'components/Link';
import Stack from '@mui/material/Stack';
import { Button } from 'components/Button';
import { IconButton } from 'components/IconButton';
import { Menu } from 'components/Menu';

export const Header = () => {
	const theme = useTheme();
	const navigate = useNavigate();

	const { toggleColorMode } = useContext(ColorModeContext);
	const { loadingSignOut, user, signOut } = useAuth();
	const { copy } = useCopyToClipboard();

	const renderPrincipalId = useMemo(() => {
		if (user) {
			const principalId = user.user_id.toText();
			const first = principalId.split('-')[0];
			const last = principalId.split('-').pop();

			return `${first}...${last}`;
		}

		return 'Authenticate';
	}, [user]);

	const handleOnAddressCopy = () => {
		if (!user) {
			return;
		}

		copy(user.user_id.toText());
	};
	const colorMode = theme.palette.mode;

	return (
		<Appbar>
			<Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
				<Link href="/">Circuitz</Link>
			</Box>
			<Stack direction="row" spacing={1}>
				{user ? (
					<Button onClick={handleOnAddressCopy} tooltip="Copy principal">
						{renderPrincipalId.toUpperCase()}
					</Button>
				) : null}
				<IconButton
					icon={colorMode === 'dark' ? 'moon' : 'sun'}
					tooltip={colorMode === 'dark' ? 'Power on' : 'Power off'}
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
									navigate('/authenticate');
								}
							}
						]}
					/>
				) : null}
			</Stack>
		</Appbar>
	);
};
