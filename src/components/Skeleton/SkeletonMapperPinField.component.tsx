import { Skeleton, Stack } from '@mui/material';

export const SkeletonMapperPinField = () => {
	return (
		<Stack spacing={1} padding={1}>
			{Array.from({ length: 3 }).map((_, i) => (
				<Stack key={i} direction="row" spacing={1}>
					<Skeleton variant="rounded" height={60} width="100%" />
					<Skeleton variant="rounded" height={60} width="100%" />
				</Stack>
			))}
		</Stack>
	);
};
