import { ButtonBase, Stack } from '@mui/material';
import { Icon } from 'components/Icon';
import { Tooltip } from 'components/Tooltip';
import { Icons } from 'components/icons';

export const AddNodeButton = ({ label, icon, onClick }: { label: string; icon: Icons; onClick: () => void }) => {
	return (
		<Tooltip label={label}>
			<ButtonBase
				onClick={onClick}
				sx={{
					p: 1,
					border: theme => `1px dashed ${theme.palette.divider}`,
					borderRadius: 1
				}}
			>
				<Stack
					alignItems="center"
					justifyContent="center"
					sx={{
						p: 1,
						backgroundColor: 'background.default',
						borderRadius: 1
					}}
				>
					<Icon color="primary" icon={icon} />
				</Stack>
			</ButtonBase>
		</Tooltip>
	);
};
