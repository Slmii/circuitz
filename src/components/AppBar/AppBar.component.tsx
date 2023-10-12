import { useMediaQuery } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import { DISABLE_MARGIN_MEDIA_QUERY } from 'lib/constants/theme.constants';
import { PropsWithChildren } from 'react';

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

export const Appbar = ({ children }: PropsWithChildren) => {
	const isDisableMargin = useMediaQuery(DISABLE_MARGIN_MEDIA_QUERY);

	return (
		<>
			<AppBar
				position="fixed"
				sx={{
					backgroundImage: 'none',
					backgroundColor: 'transparent',
					boxShadow: 'none',
					backdropFilter: 'blur(10px)'
				}}
			>
				<Toolbar
					sx={{
						mx: isDisableMargin ? 0 : 5
					}}
				>
					{children}
				</Toolbar>
			</AppBar>
			<Offset />
		</>
	);
};
