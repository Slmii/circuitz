import { Stack, ButtonBase, Fade, Box, Divider } from '@mui/material';
import { IconButton } from 'components/IconButton';
import { Caption } from 'components/Typography';
import { useOnClickOutside } from 'lib/hooks';
import { stopPropagation } from 'lib/utils';
import pluralize from 'pluralize';
import { PropsWithChildren, useState } from 'react';
import { useXarrow } from 'react-xarrows';
import { CircuitNodeProps } from './CircuitDetails.types';
import { useSetRecoilState } from 'recoil';
import { deleteNodeState } from 'lib/recoil';

export const CircuitNode = ({
	nodeId,
	isFirst,
	trace,
	nested = false,
	onClick,
	children
}: PropsWithChildren<CircuitNodeProps>) => {
	const updateXarrow = useXarrow();
	const [isShowSettings, setIsShowSettings] = useState(false);
	const [isShowPins, setIsShowPins] = useState(false);

	const setDeleteNode = useSetRecoilState(deleteNodeState);
	const ref = useOnClickOutside(() => setIsShowPins(false));

	return (
		<Stack direction="row" spacing={2} alignItems="center" ref={ref}>
			<ButtonBase
				id={`node-${nodeId}`}
				onClick={onClick}
				onLoad={updateXarrow}
				onMouseEnter={() => nodeId && setIsShowSettings(true)}
				onMouseLeave={() => nodeId && setIsShowSettings(false)}
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'flex-start',
					gap: 1,
					p: 2,
					width: 400,
					mb: 8,
					ml: nested ? 15 : 0,
					backgroundColor: 'background.default',
					borderRadius: 1,
					color: 'text.primary',
					border: theme => `1px solid ${theme.palette.divider}`
				}}
			>
				<Stack direction="row" width="100%" justifyContent="space-between" alignItems="center">
					<Stack direction="row" alignItems="center" spacing={1}>
						{children}
					</Stack>
					{trace && trace.errors.length && (
						<Caption color="error.main">
							{trace.errors.length} {pluralize('error', trace.errors.length)}
						</Caption>
					)}
					<Fade in={isShowSettings}>
						<Box>
							<IconButton
								component="div"
								size="small"
								icon="settings"
								tooltip="Setting"
								{...stopPropagation({
									onClick: () => setIsShowPins(!isShowPins)
								})}
							/>
						</Box>
					</Fade>
				</Stack>
			</ButtonBase>
			<Fade in={isShowPins}>
				<Stack direction="row" spacing={1}>
					<IconButton
						icon="trash"
						size="small"
						tooltip="Delete Node"
						onClick={() => {
							setIsShowPins(false);
							setDeleteNode({ isDeleteNodeModalOpen: true, nodeToDelete: nodeId });
						}}
					/>
					{!isFirst && (
						<>
							<Divider orientation="vertical" flexItem />
							<IconButton icon="javascript" size="small" tooltip="PrePin (soon)" disabled />
							<IconButton icon="javascript" size="small" tooltip="PostPin (soon)" disabled />
							<IconButton icon="filter" size="small" tooltip="FilterPin" />
							<IconButton icon="mapper" size="small" tooltip="MapperPin" />
							<IconButton icon="transformer" size="small" tooltip="LookupTransformPin" />
						</>
					)}
				</Stack>
			</Fade>
		</Stack>
	);
};
