import { Skeleton, Stack } from '@mui/material';

export const SkeletonRules = () => {
	return (
		<Stack spacing={1} padding={1}>
			<Stack direction="row" justifyContent="space-between">
				<Skeleton height={34} width="50%" variant="rounded" />
				<Skeleton height={34} width="20%" variant="rounded" />
			</Stack>
			{Array.from({ length: 3 }).map((_, i) => (
				<Stack key={i} direction="row" spacing={1}>
					<Skeleton variant="rounded" height={60} width="100%" />
					<Skeleton variant="rounded" height={60} width="100%" />
					<Skeleton variant="rounded" height={60} width="100%" />
				</Stack>
			))}
		</Stack>
	);
};
