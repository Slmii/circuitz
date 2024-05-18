import { Stack, Fade, ButtonBase } from '@mui/material';
import { H5 } from 'components/Typography';
import { useMemo, useState } from 'react';
import { Node, NodeSourceType, PinSourceType } from 'lib/types';
import { IconButton } from 'components/IconButton';
import { AddNodeButton } from 'components/Button';
import {
	LookupNodeDrawer,
	InputNodeDrawer,
	FilterPinDrawer,
	LookupFilterPinDrawer,
	MapperPinDrawer
} from 'components/NodeDrawers';
import { getNodeMetaData } from 'lib/utils';
import { CircuitNode } from './CircuitNode.component';
import { useGetCircuit, useGetCircuitTraces, useGetParam, useOnClickOutside, useToggleNodeStatus } from 'lib/hooks';
import { Icon } from 'components/Icon';
import { useNavigate, useParams } from 'react-router-dom';

// const navigate = useNavigate();
// 	const circuitId = useGetParam('circuitId');

// 	const { data: node, isLoading: isNodeLoading } = useGetCircuitNode(Number(nodeId));

// 	const isLoaded = !!node && !isNodeLoading;
// 	if (!isLoaded) {
// 		return null;
// 	}

export const CircuitNodes = ({ nodes }: { nodes: Node[] }) => {
	const navigate = useNavigate();
	const [isAddNode, setIsAddNode] = useState(false);
	const { nodeId, pinType, nodeType } = useParams<{
		nodeId: string;
		pinType: PinSourceType;
		nodeType: NodeSourceType;
	}>();

	const circuitId = useGetParam('circuitId');
	const ref = useOnClickOutside(() => setIsAddNode(false));
	const { data: circuit, isLoading: isCircuitLoading } = useGetCircuit(Number(circuitId));
	const { data: circuitTraces, isLoading: isCircuitTracesLoading } = useGetCircuitTraces(Number(circuitId));
	const { mutate: toggleStatus } = useToggleNodeStatus();

	const node = useMemo(() => {
		if (!nodeId) {
			return;
		}

		return nodes.find(node => node.id === Number(nodeId));
	}, [nodeId, nodes]);

	const filterPin = useMemo(() => {
		if (pinType !== 'FilterPin' || !nodeId) {
			return;
		}

		return nodes.find(node => node.id === Number(nodeId));
	}, [pinType, nodeId, nodes]);

	const lookupFilterPin = useMemo(() => {
		if (pinType !== 'LookupFilterPin' || !nodeId) {
			return;
		}

		return nodes.find(node => node.id === Number(nodeId));
	}, [pinType, nodeId, nodes]);

	const mapperPin = useMemo(() => {
		if ((pinType !== 'PreMapperPin' && pinType !== 'PostMapperPin') || !nodeId) {
			return;
		}

		return nodes.find(node => node.id === Number(nodeId));
	}, [pinType, nodeId, nodes]);

	const traces = useMemo(() => {
		if (!circuitTraces) {
			return [];
		}

		return circuitTraces.filter(trace => trace.errors.filter(error => !error.resolvedAt));
	}, [circuitTraces]);

	const isLoaded = !!circuit && !isCircuitLoading && !!circuitTraces && !isCircuitTracesLoading;
	if (!isLoaded) {
		return null;
	}

	return (
		<>
			<Stack direction="column" gap={1} width="100%">
				{!nodes.length ? (
					// Show 'Add Input Node' button if there are no nodes at all
					<Stack
						sx={{
							backgroundColor: 'background.paper',
							borderRadius: 1
						}}
					>
						<ButtonBase
							onClick={() => navigate(`/circuits/${circuitId}/nodes/Canister`)}
							sx={{
								p: 2,
								justifyContent: 'flex-start',
								borderRadius: 'inherit'
							}}
						>
							<Icon icon="add-linear" spacingRight />
							<H5 fontWeight="bold">Add Input Node</H5>
						</ButtonBase>
					</Stack>
				) : (
					<>
						{nodes.map((node, index) => (
							<CircuitNode
								key={node.id}
								node={node}
								index={index + 1}
								trace={traces.find(trace => trace.nodeId === node.id)}
								onToggleNodeStatus={node =>
									toggleStatus({ circuitId: node.circuitId, nodeId: node.id, enabled: node.isEnabled })
								}
								onNodeSelect={node => navigate(`/circuits/${circuitId}/nodes/${node.id}/${getNodeMetaData(node).type}`)}
							/>
						))}
						<Stack direction="column" spacing={1} mt={4} alignItems="flex-start">
							<IconButton icon={!isAddNode ? 'add-square' : 'close-square'} onClick={() => setIsAddNode(!isAddNode)} />
							<Fade in={isAddNode}>
								<Stack direction="column" spacing={1} ref={ref}>
									<H5>What's next?</H5>
									<Stack direction="row" alignItems="center" spacing={2}>
										<AddNodeButton
											icon="infinite"
											label="Lookup Canister"
											onClick={() => {
												setIsAddNode(false);
												navigate(`/circuits/${circuitId}/nodes/LookupCanister`);
											}}
										/>
										<AddNodeButton
											icon="request"
											label="Lookup HTTP Request"
											onClick={() => {
												setIsAddNode(false);
												navigate(`/circuits/${circuitId}/nodes/LookupHttpRequest`);
											}}
										/>
										<AddNodeButton icon="output-linear" label="Output" onClick={() => {}} />
									</Stack>
								</Stack>
							</Fade>
						</Stack>
					</>
				)}
			</Stack>
			<InputNodeDrawer
				nodeType={nodeType}
				open={nodeType === 'Canister' || nodeType === 'HttpRequest'}
				node={node}
				onClose={() => navigate(`/circuits/${circuitId}`, { replace: true })}
			/>
			<LookupNodeDrawer
				open={nodeType === 'LookupCanister' || nodeType === 'LookupHttpRequest'}
				nodeType={nodeType as NodeSourceType}
				node={node}
				onClose={() => navigate(`/circuits/${circuitId}`, { replace: true })}
			/>
			<FilterPinDrawer open={!!filterPin} node={filterPin} onClose={() => navigate(`/circuits/${circuitId}`)} />
			<LookupFilterPinDrawer
				open={!!lookupFilterPin}
				node={lookupFilterPin}
				onClose={() => navigate(`/circuits/${circuitId}`, { replace: true })}
			/>
			<MapperPinDrawer
				open={pinType === 'PreMapperPin' || pinType === 'PostMapperPin'}
				node={mapperPin}
				pinType={pinType as PinSourceType}
				onClose={() => navigate(`/circuits/${circuitId}`, { replace: true })}
			/>
		</>
	);
};
