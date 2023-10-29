import { Stack, ButtonBase, Fade, Chip, Box } from '@mui/material';
import { IconButton } from 'components/IconButton';
import { B1, B2, Caption, H5 } from 'components/Typography';
import { getNodeMetaData, getNodeIcon, stopPropagation } from 'lib/utils';
import { Node } from 'lib/types';
import pluralize from 'pluralize';
import { useMemo, useState } from 'react';
import { CircuitNodeProps } from './CircuitDetails.types';
import { useSetRecoilState } from 'recoil';
import { deleteNodeState, pinDrawerState } from 'lib/recoil';
import { Icon } from 'components/Icon';
import { StandaloneSwitch } from 'components/Form/Switch';
import { CircularProgress } from 'components/Progress';

const absolutePosition = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)'
};

export const CircuitNode = ({ node, trace, index, onNodeSelect, onToggleNodeStatus }: CircuitNodeProps) => {
	const [isShowAdd, setIsShowAdd] = useState(false);
	const [isShowPins, setIsShowPins] = useState(false);
	const [delayHandler, setDelayHandler] = useState<NodeJS.Timeout | null>(null);

	const { description, name, type } = useMemo(() => {
		return getNodeMetaData(node);
	}, [node]);

	const isInputNode = type === 'Canister' || type === 'HttpRequest';

	const handleMouseEnter = () => {
		setDelayHandler(
			setTimeout(() => {
				setIsShowAdd(true);
			}, 300)
		);
	};

	const handleMouseLeave = () => {
		setIsShowAdd(false);
		setIsShowPins(false);

		if (delayHandler) {
			clearTimeout(delayHandler);
		}
	};

	return (
		<Stack direction="row" alignItems="center" spacing={2}>
			<B1
				fontWeight="bold"
				sx={{
					width: 10
				}}
			>
				{index + 1}
			</B1>
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="flex-start"
				width="100%"
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				sx={{
					position: 'relative',
					backgroundColor: 'background.paper',
					borderRadius: 1
				}}
			>
				<ButtonBase
					onClick={() => onNodeSelect(node)}
					sx={{
						width: '100%',
						gap: 2,
						p: 2,
						justifyContent: 'flex-start',
						borderTopLeftRadius: 'inherit',
						borderBottomLeftRadius: 'inherit'
					}}
				>
					<Icon icon={isInputNode ? 'input-linear' : getNodeIcon(node)} color="primary" />
					<Stack direction="column" alignItems="flex-start">
						<H5 fontWeight="bold">{name}</H5>
						<B2 color="text.secondary">{description}</B2>
						<Caption mt={1} color="text.primary" fontWeight="bold">
							Type: {isInputNode ? 'Input Node' : type}
						</Caption>
						{trace?.errors.length && (
							<Caption mt={1} color="error.main">
								{trace.errors.length} {pluralize('error', trace?.errors.length)}
							</Caption>
						)}
					</Stack>
				</ButtonBase>
				<Stack direction="row" alignItems="center" spacing={1} p={2}>
					<Chip
						label={node.isEnabled ? 'Active' : 'Inactive'}
						size="small"
						color={node.isEnabled ? 'success' : 'error'}
					/>
					<StandaloneSwitch value={node.isEnabled} name="active" onChange={() => onToggleNodeStatus(node)} />
					{node.isRunning && (
						<Stack direction="row" alignItems="center" spacing={1} sx={{ ml: '24px !important' }}>
							<CircularProgress />
							<B1>Running</B1>
						</Stack>
					)}
				</Stack>
				<Fade in={isShowAdd && !isShowPins} unmountOnExit>
					<Box sx={absolutePosition}>
						<IconButton
							icon="add-linear"
							color="primary"
							sx={{
								border: theme => `1px solid ${theme.palette.primary.main}`
							}}
							onClick={() => setIsShowPins(prevState => !prevState)}
						/>
					</Box>
				</Fade>
				<Fade in={isShowPins} unmountOnExit>
					<Stack direction="row" spacing={1} sx={absolutePosition}>
						<NodePins
							node={node}
							isInputNode={isInputNode}
							onClosePins={() => {
								setIsShowAdd(false);
								setIsShowPins(false);
							}}
						/>
					</Stack>
				</Fade>
			</Stack>
		</Stack>
	);
};

const NodePins = ({
	node,
	isInputNode,
	onClosePins
}: {
	node: Node;
	isInputNode: boolean;
	onClosePins: () => void;
}) => {
	const setPrinDrawer = useSetRecoilState(pinDrawerState);
	const setDeleteNode = useSetRecoilState(deleteNodeState);

	return (
		<>
			<IconButton
				icon="trash"
				color="error"
				tooltip="Delete Node"
				{...stopPropagation({
					onClick: () => {
						onClosePins();
						setDeleteNode({ open: true, nodeId: node.id });
					}
				})}
			/>
			{!isInputNode && (
				<>
					<IconButton
						icon="filter"
						tooltip="FilterPin"
						{...stopPropagation({
							onClick: () => {
								onClosePins();
								setPrinDrawer({ open: true, node, type: 'FilterPin' });
							}
						})}
					/>
					{('LookupCanister' in node.nodeType || 'LookupHttpRequest' in node.nodeType) && (
						// Only for Lookups
						<>
							<IconButton
								icon="filter"
								tooltip="LookupFilterPin"
								{...stopPropagation({
									onClick: () => {
										onClosePins();
										setPrinDrawer({ open: true, type: 'LookupFilterPin' });
									}
								})}
							/>
							<IconButton
								icon="transformer"
								tooltip="LookupTransformPin"
								{...stopPropagation({
									onClick: () => {
										onClosePins();
										setPrinDrawer({ open: true, type: 'LookupTransformPin' });
									}
								})}
							/>
						</>
					)}
					<IconButton icon="javascript" tooltip="PrePin (soon)" disabled />
					<IconButton icon="javascript" tooltip="PostPin (soon)" disabled />
				</>
			)}
			<IconButton
				icon="close-linear"
				tooltip="Close"
				{...stopPropagation({
					onClick: onClosePins
				})}
			/>
		</>
	);
};
