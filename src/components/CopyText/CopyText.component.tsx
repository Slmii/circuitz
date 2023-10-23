import { Button } from 'components/Button';
import { useCopyToClipboard } from 'lib/hooks';
import { PropsWithChildren } from 'react';

export const CopyText = ({ textToCopy, children }: PropsWithChildren<{ textToCopy: string }>) => {
	const { copy } = useCopyToClipboard();

	return (
		<Button
			disableElevation
			component="code"
			size="small"
			color="secondary"
			variant="contained"
			sx={{ minHeight: 'unset', px: 0.5 }}
			onClick={() => copy(textToCopy)}
		>
			{children}
		</Button>
	);
};
