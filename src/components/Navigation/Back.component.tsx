import { ButtonBase, Stack } from '@mui/material';
import { Icon } from 'components/Icon';
import { B1 } from 'components/Typography';
import { useNavigate } from 'react-router-dom';

export const Back = ({ label = 'Go back', onBack }: { label?: string; onBack?: () => void }) => {
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
			sx={{
				borderRadius: 1
			}}
		>
			<Icon icon="arrow-left" />
			<B1>{label}</B1>
		</Stack>
	);
};
