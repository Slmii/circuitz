import { Paper, Grid, Stack, Typography, Box } from '@mui/material';
import { IconButton } from 'components/IconButton';
import { Link } from 'components/Link';
import { Menu } from 'components/Menu';
import { Circuit as ICircuit } from 'lib/types';

export const Circuit = ({ circuit, onEdit }: { circuit: ICircuit; onEdit: () => void }) => {
	return (
		<Grid item xs={12} sm={6} md={4}>
			<Paper
				component={Stack}
				alignItems="center"
				justifyContent="center"
				sx={{
					p: 2,
					height: 300,
					width: '100%',
					backgroundColor: 'transparent',
					border: theme => `3px solid ${theme.palette.primary.main}`,
					position: 'relative',
					'&:hover': {
						borderRadius: 0,
						boxShadow: theme => `5px 5px 0px 0px ${theme.palette.secondary.main}}`
					}
				}}
			>
				<Menu
					label={
						<IconButton
							sx={{
								position: 'absolute',
								top: theme => theme.spacing(2),
								right: theme => theme.spacing(2)
							}}
							icon="more"
							size="small"
						/>
					}
					id="circuit-menu"
					menu={[
						{
							id: 'edit',
							label: 'Edit',
							icon: 'edit',
							action: onEdit
						},
						{
							id: 'clone',
							label: 'Clone',
							icon: 'copy'
						},
						{
							id: 'delete',
							label: 'Delete',
							color: 'error',
							icon: 'trash'
						}
					]}
				/>
				<Stack direction="column" spacing={1}>
					<Link href={`/circuits/1`}>
						<Typography fontWeight="bold" variant="h5">
							{circuit.name}
						</Typography>
					</Link>
					<Stack direction="column" alignItems="center">
						<Typography variant="caption" color="text.secondary">
							0.9T
						</Typography>
						<Typography variant="caption" color="text.secondary">
							Active
						</Typography>
						<Typography variant="caption" color="text.secondary">
							20MB
						</Typography>
					</Stack>
				</Stack>
				<Stack
					direction="row"
					spacing={1}
					sx={{ position: 'absolute', bottom: theme => theme.spacing(2), left: theme => theme.spacing(2) }}
				>
					<Box sx={{ width: 24, height: 24, backgroundColor: 'error.dark', borderRadius: '50%' }} />
					<Typography variant="caption" color="error.main">
						25 errors
					</Typography>
				</Stack>
			</Paper>
		</Grid>
	);
};
