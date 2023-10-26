import { Box, Stack, Skeleton } from '@mui/material';
import { CircuitCardPaper } from 'views/CircuitsList';

export const SkeletonCircuitCard = () => {
	return (
		<Box
			sx={{
				flex: '1 1 300px'
			}}
		>
			<CircuitCardPaper>
				<Stack direction="column" spacing={2} width="100%">
					<Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
						<Skeleton width="50%" height={33} variant="rounded" />
						<Skeleton width="20%" height={33} variant="circular" />
					</Stack>
					<Stack direction="column" spacing={1}>
						<Skeleton width="50%" variant="text" />
						<SkeletonCircuitStatus />
					</Stack>
				</Stack>
			</CircuitCardPaper>
		</Box>
	);
};

export const SkeletonCircuitStatus = () => {
	return (
		<Stack direction="row" spacing={1}>
			<Skeleton width="100%" variant="text" />
			<Skeleton width="100%" variant="text" />
			<Skeleton width="100%" variant="text" />
		</Stack>
	);
};
