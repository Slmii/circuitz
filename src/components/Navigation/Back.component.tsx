import { ButtonBase, Stack } from '@mui/material';
import { Icon } from 'components/Icon';
import { Paragraph } from 'components/Typography';
import { useNavigate } from 'react-router-dom';

export const Back = ({ onBack }: { onBack?: () => void }) => {
	const navigate = useNavigate();

	return (
		<Stack
			onClick={() => {
				if (onBack) {
					return onBack();
				}

				navigate(-1);
			}}
			component={ButtonBase}
			direction="row"
			spacing={1}
			alignItems="center"
		>
			<Icon icon="arrow-left" />
			<Paragraph>Go back</Paragraph>
		</Stack>
	);
};
