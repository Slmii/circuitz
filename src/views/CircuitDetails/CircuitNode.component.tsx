import { Stack, ButtonBase, Fade, Chip, Box } from '@mui/material';
import { IconButton } from 'components/IconButton';
import { B1, B2, Caption, H5 } from 'components/Typography';
import { getNodeMetaData, getNodeIcon, stopPropagation } from 'lib/utils';
import { Node } from 'lib/types';
import pluralize from 'pluralize';
import { useState } from 'react';
import { CircuitNodeProps } from './CircuitDetails.types';
import { useSetRecoilState } from 'recoil';
import { deleteNodeState, pinDrawerState } from 'lib/recoil';
import { Icon } from 'components/Icon';
import { StandaloneSwitch } from 'components/Form/Switch';
import { CircularProgress } from 'components/Progress';
import { useDraggable } from 'lib/hooks';

export const CircuitNode = ({ node, trace, isFirst, index, onNodeSelect, onMoveNode }: CircuitNodeProps) => {
	const [isShowPins, setIsShowPins] = useState(false);
	const [delayHandler, setDelayHandler] = useState<NodeJS.Timeout | null>(null);

	const { dragRef, handlerId, opacity, previewRef } = useDraggable(index, onMoveNode);
	const { description, name, type } = getNodeMetaData(node);

	const handleMouseEnter = () => {
		setDelayHandler(
			setTimeout(() => {
				setIsShowPins(true);
			}, 500)
		);
	};

	const handleMouseLeave = () => {
		setIsShowPins(false);

		if (delayHandler) {
			clearTimeout(delayHandler);
		}
	};

	return (
		<Stack
			direction="row"
			alignItems="center"
			spacing={2}
			{...(!isFirst && {
				ref: previewRef,
				'data-handler-id': handlerId
			})}
			sx={{
				opacity
			}}
		>
			<Stack direction="row" alignItems="center" spacing={1}>
				{!isFirst && (
					<Box ref={dragRef}>
						<Icon
							icon="drag"
							color="secondary"
							sx={{
								'&:hover': {
									cursor: 'grab'
								}
							}}
						/>
					</Box>
				)}
				<B1
					sx={{
						width: 10
					}}
				>
					{index + 1}
				</B1>
			</Stack>
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="flex-start"
				width="100%"
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				sx={{
					backgroundColor: 'background.paper',
					borderRadius: 1
				}}
			>
				<ButtonBase
					onClick={() => onNodeSelect(node)}
					sx={{
						position: 'relative',
						width: '100%',
						gap: 2,
						p: 2,
						justifyContent: 'flex-start',
						borderTopLeftRadius: 'inherit',
						borderBottomLeftRadius: 'inherit'
					}}
				>
					<Icon icon={isFirst ? 'input-linear' : getNodeIcon(node)} color="primary" />
					<Stack direction="column" alignItems="flex-start">
						<H5 fontWeight="bold">{name}</H5>
						<B2 color="text.secondary">{description}</B2>
						<Caption mt={1} color="text.primary" fontWeight="bold">
							Type: {isFirst ? 'Input Node' : type}
						</Caption>
						{trace?.errors.length && (
							<Caption mt={1} color="error.main">
								{trace.errors.length} {pluralize('error', trace?.errors.length)}
							</Caption>
						)}
					</Stack>
					<NodePins node={node} isFirstNode={isFirst} isShowPins={isShowPins} />
				</ButtonBase>
				<Stack direction="row" alignItems="center" spacing={1} p={2}>
					<Chip
						label={node.isEnabled ? 'Active' : 'Inactive'}
						size="small"
						color={node.isEnabled ? 'success' : 'error'}
					/>
					<StandaloneSwitch value={node.isEnabled} name="active" onChange={() => {}} />
					{node.isRunning && (
						<Stack direction="row" alignItems="center" spacing={1} sx={{ ml: '24px !important' }}>
							<CircularProgress />
							<B1>Running</B1>
						</Stack>
					)}
				</Stack>
			</Stack>
		</Stack>
	);
};

const NodePins = ({ node, isShowPins, isFirstNode }: { node: Node; isShowPins: boolean; isFirstNode: boolean }) => {
	const setPrinDrawer = useSetRecoilState(pinDrawerState);
	const setDeleteNode = useSetRecoilState(deleteNodeState);

	return (
		<Fade in={isShowPins}>
			<Stack direction="row" spacing={1} sx={{ position: 'absolute', top: theme => theme.spacing(2), right: 0 }}>
				<IconButton
					icon="trash"
					size="small"
					color="error"
					tooltip="Delete Node"
					{...stopPropagation({
						onClick: () => setDeleteNode({ open: true, nodeId: node.id })
					})}
				/>
				{!isFirstNode && (
					<>
						<IconButton icon="javascript" size="small" tooltip="PrePin (soon)" disabled />
						<IconButton icon="javascript" size="small" tooltip="PostPin (soon)" disabled />
						<IconButton
							icon="filter"
							size="small"
							tooltip="FilterPin"
							{...stopPropagation({
								onClick: () => setPrinDrawer({ open: true, type: 'FilterPin' })
							})}
						/>
						{('LookupCanister' in node.nodeType || 'LookupHttpRequest' in node.nodeType) && (
							// Only for Lookups
							<IconButton
								icon="transformer"
								size="small"
								tooltip="LookupTransformPin"
								{...stopPropagation({
									onClick: () => setPrinDrawer({ open: true, type: 'LookupTransformPin' })
								})}
							/>
						)}
					</>
				)}
			</Stack>
		</Fade>
	);
};
