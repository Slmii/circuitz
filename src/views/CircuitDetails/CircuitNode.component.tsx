import { Stack, ButtonBase, Fade, Chip, Box } from '@mui/material';
import { IconButton } from 'components/IconButton';
import { B1, B2, Caption, H5 } from 'components/Typography';
import { getNodeMetaData, getNodeIcon, stopPropagation, getPin } from 'lib/utils';
import { Node } from 'lib/types';
import pluralize from 'pluralize';
import { useMemo, useState } from 'react';
import { CircuitNodeProps } from './CircuitDetails.types';
import { Icon } from 'components/Icon';
import { StandaloneSwitch } from 'components/Form/Switch';
import { CircularProgress } from 'components/Progress';
import { FilterPin } from 'declarations/nodes.declarations';
import { useNavigate } from 'react-router-dom';

const absolutePosition = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)'
};

export const CircuitNode = ({ node, index, trace, onNodeSelect, onToggleNodeStatus }: CircuitNodeProps) => {
	const [isShowAdd, setIsShowAdd] = useState(false);
	const [isShowPins, setIsShowPins] = useState(false);
	const [delayHandler, setDelayHandler] = useState<NodeJS.Timeout | null>(null);

	const { description, name, type } = useMemo(() => {
		return getNodeMetaData(node);
	}, [node]);

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

	const isInputNode = type === 'Canister' || type === 'HttpRequest';
	const pinsCount = node.pins.length;

	return (
		<Stack direction="row" alignItems="center" spacing={2}>
			<B1
				fontWeight="bold"
				sx={{
					width: 10
				}}
			>
				{index}
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
				<Stack direction="row" alignItems="center" gap={1} p={2}>
					<Chip
						label={node.isEnabled ? 'Active' : 'Inactive'}
						size="small"
						color={node.isEnabled ? 'success' : 'error'}
					/>
					<StandaloneSwitch value={node.isEnabled} name="active" onChange={() => onToggleNodeStatus(node)} />
					{node.isRunning && (
						<Stack direction="row" alignItems="center" spacing={1} sx={{ ml: 3 }}>
							<CircularProgress />
							<B1>Running</B1>
						</Stack>
					)}
				</Stack>
				<ExistingPins node={node} isShowPins={isShowPins} />
				<Fade in={isShowAdd && !isShowPins} unmountOnExit>
					<Box
						sx={{
							...absolutePosition,
							ml: `${pinsCount * 48}px`
						}}
					>
						<IconButton
							icon={isInputNode ? 'settings' : 'add-linear'}
							color="primary"
							tooltip={isInputNode ? 'Settings' : 'Add Pin'}
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
								setIsShowAdd(true);
								setIsShowPins(false);
							}}
						/>
					</Stack>
				</Fade>
			</Stack>
		</Stack>
	);
};

const ExistingPins = ({ node, isShowPins }: { node: Node; isShowPins: boolean }) => {
	const navigate = useNavigate();

	const hasFilterPin = !!getPin<FilterPin>(node, 'FilterPin');
	const hasPreMapperPin = !!getPin<FilterPin>(node, 'PreMapperPin');
	const hasPostMapperPin = !!getPin<FilterPin>(node, 'PostMapperPin');
	const hasLookupFilterPin = !!getPin<FilterPin>(node, 'LookupFilterPin');

	return (
		<Stack
			direction="row"
			spacing={1}
			sx={{
				...absolutePosition,
				display: isShowPins ? 'none' : 'flex',
				transition: theme => theme.transitions.create(['display'], { duration: 250 })
			}}
		>
			{hasFilterPin && (
				// Show only if FilterPin is present
				<IconButton
					icon="filter"
					tooltip="FilterPin"
					color="primary"
					{...stopPropagation({
						onClick: () => navigate(`/circuits/${node.circuitId}/nodes/${node.id}/FilterPin/edit`)
					})}
				/>
			)}
			{hasLookupFilterPin && (
				// Show only if LookupFilterPin is present
				<IconButton
					icon="filter"
					tooltip="LookupFilterPin"
					color="primary"
					{...stopPropagation({
						onClick: () => navigate(`/circuits/${node.circuitId}/nodes/${node.id}/LookupFilterPin/edit`)
					})}
				/>
			)}
			{hasPreMapperPin && (
				// Show only if PreMapperPin is present
				<IconButton
					icon="mapper"
					tooltip="PreMapperPin"
					color="primary"
					{...stopPropagation({
						onClick: () => navigate(`/circuits/${node.circuitId}/nodes/${node.id}/PreMapperPin/edit`)
					})}
				/>
			)}
			{hasPostMapperPin && (
				// Show only if PostMapperPin is present
				<IconButton
					icon="mapper"
					tooltip="PostMapperPin"
					color="primary"
					{...stopPropagation({
						onClick: () => navigate(`/circuits/${node.circuitId}/nodes/${node.id}/PostMapperPin/edit`)
					})}
				/>
			)}
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
	const navigate = useNavigate();

	const hasFilterPin = !!getPin<FilterPin>(node, 'FilterPin');
	const hasPreMapperPin = !!getPin<FilterPin>(node, 'PreMapperPin');
	const hasPostMapperPin = !!getPin<FilterPin>(node, 'PostMapperPin');
	const hasLookupFilterPin = !!getPin<FilterPin>(node, 'LookupFilterPin');

	const metadata = getNodeMetaData(node);

	return (
		<>
			{!isInputNode && (
				<>
					{!hasFilterPin && (
						// Show only if FilterPin is not present
						<IconButton
							icon="filter"
							tooltip="FilterPin"
							{...stopPropagation({
								onClick: () => {
									onClosePins();
									navigate(`/circuits/${node.circuitId}/nodes/${node.id}/FilterPin/add`);
								}
							})}
						/>
					)}
					{(metadata.type === 'LookupCanister' || metadata.type === 'LookupHttpRequest') && (
						// Only for Lookups
						<>
							{!hasLookupFilterPin && (
								// Show only if LookupFilterPin is not present
								<IconButton
									icon="filter"
									tooltip="LookupFilterPin"
									{...stopPropagation({
										onClick: () => {
											onClosePins();
											navigate(`/circuits/${node.circuitId}/nodes/${node.id}/LookupFilterPin/add`);
										}
									})}
								/>
							)}
						</>
					)}
					{!hasPreMapperPin && (
						// Show only if PreMapperPin is not present
						<IconButton
							icon="mapper"
							tooltip="PreMapperPin"
							{...stopPropagation({
								onClick: () => {
									onClosePins();
									navigate(`/circuits/${node.circuitId}/nodes/${node.id}/PreMapperPin/add`);
								}
							})}
						/>
					)}
					{!hasPostMapperPin && (
						// Show only if PostMapperPin is not present
						<IconButton
							icon="mapper"
							tooltip="PostMapperPin"
							{...stopPropagation({
								onClick: () => {
									onClosePins();
									navigate(`/circuits/${node.circuitId}/nodes/${node.id}/PostMapperPin/add`);
								}
							})}
						/>
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
