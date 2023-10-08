import { PropsWithChildren } from 'react';
import Paper from '@mui/material/Paper';
import { Icons } from 'components/icons';
import { Icon } from 'components/Icon';
import Stack from '@mui/material/Stack';
import { Paragraph } from 'components/Typography';

export const Alert = ({ children }: PropsWithChildren) => {
	return (
		<Stack
			component={Paper}
			spacing={0.75}
			padding={0.75}
			direction="row"
			alignItems="center"
			justifyContent="space-between"
		>
			{children}
		</Stack>
	);
};

const AlertTitle = ({ children }: PropsWithChildren) => {
	return <Paragraph>{children}</Paragraph>;
};

const AlertIcon = ({ icon }: { icon: Icons }) => {
	return <Icon icon={icon} />;
};

Alert.AlertTitle = AlertTitle;
Alert.AlertIcon = AlertIcon;
