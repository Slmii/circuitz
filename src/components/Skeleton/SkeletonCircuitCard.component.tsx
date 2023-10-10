import { Box, Stack, Skeleton } from '@mui/material';
import { CircuitCard } from 'components/CircuitCard';

export const SkeletonCircuitCard = () => {
	return (
		<Box
			sx={{
				flex: '1 1 300px'
			}}
		>
			<CircuitCard>
				<Stack direction="column" spacing={1} width="100%">
					<Skeleton width="100%" sx={{ height: 36 }} variant="rectangular" />
					<Stack direction="column" alignItems="center" spacing={0.5}>
						<Skeleton width="100%" sx={{ height: 23 }} variant="rectangular" />
						<Skeleton width="100%" sx={{ height: 23 }} variant="rectangular" />
						<Skeleton width="100%" sx={{ height: 23 }} variant="rectangular" />
					</Stack>
				</Stack>
				<SkeletonCircuitMetaData />
			</CircuitCard>
		</Box>
	);
};

export const SkeletonCircuitMetaData = () => {
	return (
		<Stack
			direction="column"
			width="100%"
			spacing={1}
			sx={{ position: 'absolute', bottom: theme => theme.spacing(2), left: theme => theme.spacing(2) }}
		>
			<Stack direction="row" spacing={1} alignItems="center">
				<Skeleton sx={{ height: 20, width: 20 }} variant="circular" />
				<Skeleton width="25%" sx={{ height: 23 }} variant="rectangular" />
			</Stack>
			<Stack direction="row" spacing={1} alignItems="center">
				<Skeleton width="25%" sx={{ height: 23 }} variant="rectangular" />
				<Skeleton width="25%" sx={{ height: 23 }} variant="rectangular" />
				<Skeleton width="25%" sx={{ height: 23 }} variant="rectangular" />
			</Stack>
		</Stack>
	);
};
