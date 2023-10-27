import { Stack, ButtonBase, Fade, Chip } from '@mui/material';
import { IconButton } from 'components/IconButton';
import { B1, Caption, H5 } from 'components/Typography';
import { getNodeMetaData, getNodeIcon, stopPropagation } from 'lib/utils';
import { Node } from 'lib/types';
import pluralize from 'pluralize';
import { useRef, useState } from 'react';
import { CircuitNodeProps } from './CircuitDetails.types';
import { useSetRecoilState } from 'recoil';
import { deleteNodeState, pinDrawerState } from 'lib/recoil';
import { Icon } from 'components/Icon';
import { StandaloneSwitch } from 'components/Form/Switch';
import { CircularProgress } from 'components/Progress';
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core';

interface DragItem {
	index: number;
	id: string;
	type: string;
}

const ItemTypes = {
	CARD: 'card'
};

export const CircuitNode = ({ node, trace, isFirst, index, onNodeSelect, onMoveNode }: CircuitNodeProps) => {
	const ref = useRef<HTMLDivElement>(null);
	const [isShowPins, setIsShowPins] = useState(false);
	const [delayHandler, setDelayHandler] = useState<NodeJS.Timeout | null>(null);

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

	const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
		accept: ItemTypes.CARD,
		collect(monitor) {
			return {
				handlerId: monitor.getHandlerId()
			};
		},
		hover(item: DragItem, monitor) {
			if (!ref.current) {
				return;
			}

			const dragIndex = item.index;
			const hoverIndex = index;

			// Don't replace items with themselves or with the first node
			if (hoverIndex === 0 || dragIndex === hoverIndex) {
				return;
			}

			// Determine rectangle on screen
			const hoverBoundingRect = ref.current?.getBoundingClientRect();

			// Get vertical middle
			const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

			// Determine mouse position
			const clientOffset = monitor.getClientOffset();

			// Get pixels to the top
			const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

			// Only perform the move when the mouse has crossed half of the items height
			// When dragging downwards, only move when the cursor is below 50%
			// When dragging upwards, only move when the cursor is above 50%

			// Dragging downwards
			if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
				return;
			}

			// Dragging upwards
			if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
				return;
			}

			// Time to actually perform the action
			onMoveNode(dragIndex, hoverIndex);

			// Note: we're mutating the monitor item here!
			// Generally it's better to avoid mutations,
			// but it's good here for the sake of performance
			// to avoid expensive index searches.
			item.index = hoverIndex;
		}
	});

	const [{ isDragging }, drag] = useDrag({
		type: ItemTypes.CARD,
		item: () => {
			return { node, index };
		},
		collect: monitor => ({
			isDragging: monitor.isDragging()
		})
	});

	drag(drop(ref));

	return (
		<Stack
			direction="row"
			alignItems="center"
			spacing={2}
			{...(!isFirst && {
				ref,
				'data-handler-id': handlerId
			})}
			sx={{
				opacity: isDragging ? 0 : 1
			}}
		>
			<Stack direction="row" alignItems="center" spacing={1}>
				{!isFirst && (
					<Icon
						icon="drag"
						color="secondary"
						sx={{
							'&:hover': {
								cursor: 'grab'
							}
						}}
					/>
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
						<B1 color="text.secondary">{description}</B1>
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
