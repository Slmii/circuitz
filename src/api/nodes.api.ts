import type {
	FilterPin,
	LookupCanisterPreview,
	LookupHttpRequestPreview,
	NodeType,
	Pin,
	_SERVICE
} from 'declarations/nodes.declarations';
import { ENV } from 'lib/constants';
import { nodesCanisterId } from './canisterIds';
import {
	generateNodeIndexKey,
	getFilterPinFormValues,
	getMapperPinOuput,
	getNodeMetaData,
	getPin,
	httpRequest,
	isFilterTrue,
	mapToNode,
	toPrincipal,
	unwrapResult
} from 'lib/utils';
import { Node, NodeSourceType, SampleData } from 'lib/types';
import { createActor } from './actor.api';

// TODO: replace hardcoded nodesCanisterId[ENV] id with a dynamic one

/**
 * Get Node by id
 */
export async function getNode(nodeId: number): Promise<Node> {
	const actor = await createActor<_SERVICE>(nodesCanisterId[ENV], 'nodes');
	const wrapped = await actor.get_circuit_node(nodeId);

	const node = await unwrapResult(wrapped);
	return mapToNode(node);
}

/**
 * Get the Nodes for a circuit
 */
export async function getNodes(circuitId: number): Promise<Node[]> {
	const actor = await createActor<_SERVICE>(nodesCanisterId[ENV], 'nodes');
	const wrapped = await actor.get_circuit_nodes(circuitId);

	const unwrapped = await unwrapResult(wrapped);
	return unwrapped[1].map(mapToNode);
}

/**
 * Delete a node from a circuit
 */
export async function deleteNode(nodeId: number): Promise<Node> {
	const actor = await createActor<_SERVICE>(nodesCanisterId[ENV], 'nodes');

	const wrapped = await actor.delete_node(nodeId);
	const unwrapped = await unwrapResult(wrapped);
	return mapToNode(unwrapped);
}

/**
 * Add a node to a circuit
 */
export async function addNode({ circuitId, data }: { circuitId: number; data: NodeType }): Promise<Node> {
	const actor = await createActor<_SERVICE>(nodesCanisterId[ENV], 'nodes');

	const wrapped = await actor.add_node(circuitId, data);
	const unwrapped = await unwrapResult(wrapped);
	return mapToNode(unwrapped);
}

/**
 * Edit a node
 */
export async function editNode({ nodeId, data }: { nodeId: number; data: NodeType }): Promise<Node> {
	const actor = await createActor<_SERVICE>(nodesCanisterId[ENV], 'nodes');

	const wrapped = await actor.edit_node(nodeId, data);
	const unwrapped = await unwrapResult(wrapped);
	return mapToNode(unwrapped);
}

/**
 * Preview Lookup Canister request
 */
export async function previewLookupCanister(data: LookupCanisterPreview) {
	const actor = await createActor<_SERVICE>(nodesCanisterId[ENV], 'nodes');
	return actor.preview_lookup_canister(data);
}

/**
 * Preview Lookup HTTP Request
 */
export async function previewLookupHTTPRequest(data: LookupHttpRequestPreview) {
	const actor = await createActor<_SERVICE>(nodesCanisterId[ENV], 'nodes');
	return actor.preview_lookup_http_request(data);
}

/**
 * Edit order of node
 */
export async function editOrder({
	nodeId,
	order
}: {
	nodeId: number;
	order: number;
	dragIndex: number;
	hoverIndex: number;
}) {
	const actor = await createActor<_SERVICE>(nodesCanisterId[ENV], 'canister');

	const unwrapped = await actor.edit_order(nodeId, order);
	return unwrapResult(unwrapped);
}

export async function getSampleData(
	nodes: Node[],
	options?: {
		/**
		 * Skip execution of specified nodes. Instead use the sample data provided in the node.
		 */
		skipNodes?: Array<NodeSourceType>;
		includePostMapper?: boolean;
	}
) {
	let sampleData: SampleData = {};

	// Get last node
	const lastNodeIndex = nodes.length - 1;

	for (const [index, node] of nodes.entries()) {
		const nodeIndex = generateNodeIndexKey(index);

		// Prefill nodeIndex key with types
		const metadata = getNodeMetaData(node);
		sampleData[nodeIndex] = {
			...(metadata.type === 'LookupCanister' && { LookupCanister: {} }),
			...(metadata.type === 'LookupHttpRequest' && { LookupHttpRequest: {} }),
			PreMapperPin: {},
			...(options?.includePostMapper && { PostMapperPin: {} })
		};

		// Skip disabled nodes
		if (!node.isEnabled) {
			continue;
		}

		// Input Nodes (Starting point)
		if ('Canister' in node.nodeType) {
			const sampleDataAsString = node.nodeType.Canister.sample_data.length ? node.nodeType.Canister.sample_data : '{}';
			sampleData = JSON.parse(sampleDataAsString);
		}

		if ('HttpRequest' in node.nodeType) {
			sampleData = await httpRequest(node.nodeType.HttpRequest);
		}
		// End Input Nodes

		// ==========

		// Pin that executes before the node and checks if the node should be executed
		const filterPin = getPin<FilterPin>(node, 'FilterPin');
		if (filterPin) {
			const filterPinFormValues = getFilterPinFormValues(filterPin);

			// If the filter is not true, skip the node
			const isTrue = isFilterTrue(filterPinFormValues);
			if (!isTrue) {
				continue;
			}
		}

		const output = getMapperPinOuput({ node, sourceType: 'PreMapperPin' });
		if (output) {
			sampleData[nodeIndex] = {
				...sampleData[nodeIndex],
				PreMapperPin: output
			};
		}

		// Lookup Nodes
		if ('LookupCanister' in node.nodeType) {
			if (!options?.skipNodes?.includes('LookupCanister')) {
				sampleData[nodeIndex] = {
					...sampleData[nodeIndex],
					LookupCanister: await previewLookupCanister({
						args: node.nodeType.LookupCanister.args.map(arg => {
							if ('String' in arg) {
								return arg.String;
							}

							if ('Number' in arg) {
								return Number(arg.Number);
							}

							if ('Boolean' in arg) {
								return arg.Boolean === 'true';
							}

							if ('Principal' in arg) {
								return toPrincipal(arg.Principal);
							}

							if ('Array' in arg) {
								return JSON.parse(arg.Array);
							}

							if ('Object' in arg) {
								return JSON.parse(arg.Object);
							}

							return BigInt(arg.BigInt);
						}),
						canister: node.nodeType.LookupCanister.canister,
						cycles: node.nodeType.LookupCanister.cycles,
						method: node.nodeType.LookupCanister.method
					})
				};
			} else {
				const parsed = JSON.parse(node.nodeType.LookupCanister.sample_data);

				sampleData[nodeIndex] = {
					...sampleData[nodeIndex],
					LookupCanister: parsed[nodeIndex]?.LookupCanister ?? {}
				};
			}
		} else if ('LookupHttpRequest' in node.nodeType) {
			if (!options?.skipNodes?.includes('LookupHttpRequest')) {
				sampleData[nodeIndex] = {
					...sampleData[nodeIndex],
					LookupHttpRequest: await httpRequest(node.nodeType.LookupHttpRequest)
				};
			} else {
				const parsed = JSON.parse(node.nodeType.LookupHttpRequest.sample_data);

				sampleData[nodeIndex] = {
					...sampleData[nodeIndex],
					LookupHttpRequest: parsed[nodeIndex]?.LookupHttpRequest ?? {}
				};
			}
		}

		// Pin that executes after the node and checks if the node should pass the data to the next node
		const lookupfilterPin = getPin<FilterPin>(node, 'LookupFilterPin');
		if (lookupfilterPin) {
			const filterPinFormValues = getFilterPinFormValues(lookupfilterPin);

			// If the lookup filter is not true, skip the merge data node
			const isTrue = isFilterTrue(filterPinFormValues);
			if (!isTrue) {
				// Remove the lookup data from the sample data
				delete sampleData[nodeIndex];

				continue;
			}
		}

		// Skip if it's the last node
		if (options?.includePostMapper || lastNodeIndex !== index) {
			const output = getMapperPinOuput({ node, sourceType: 'PostMapperPin' });
			if (output) {
				sampleData[nodeIndex] = {
					...sampleData[nodeIndex],
					PostMapperPin: output
				};
			}
		}
	}

	return sampleData;
}

/**
 * Toggle enabled/disabled state of a node
 */
export async function toggleStatus({
	nodeId,
	enabled
}: {
	nodeId: number;
	circuitId: number;
	enabled: boolean;
}): Promise<Node> {
	const actor = await createActor<_SERVICE>(nodesCanisterId[ENV], 'nodes');

	if (enabled) {
		const wrapped = await actor.disable_node(nodeId);

		const unwrapped = await unwrapResult(wrapped);
		return mapToNode(unwrapped);
	}

	const wrapped = await actor.enable_node(nodeId);

	const unwrapped = await unwrapResult(wrapped);
	return mapToNode(unwrapped);
}

/**
 * Add a pin to a node
 */
export async function addPin({ nodeId, data }: { nodeId: number; data: Pin }): Promise<Node> {
	const actor = await createActor<_SERVICE>(nodesCanisterId[ENV], 'nodes');

	const wrapped = await actor.add_pin(nodeId, data);
	const unwrapped = await unwrapResult(wrapped);
	return mapToNode(unwrapped);
}

/**
 * Edit a pin on a node
 */
export async function editPin({ nodeId, data }: { nodeId: number; data: Pin }): Promise<Node> {
	const actor = await createActor<_SERVICE>(nodesCanisterId[ENV], 'nodes');

	const wrapped = await actor.edit_pin(nodeId, data);
	const unwrapped = await unwrapResult(wrapped);
	return mapToNode(unwrapped);
}

/**
 * Delete a pin from a node
 */
export async function deletePin({ nodeId, data }: { nodeId: number; data: Pin }): Promise<Node> {
	const actor = await createActor<_SERVICE>(nodesCanisterId[ENV], 'nodes');

	const wrapped = await actor.delete_pin(nodeId, data);
	const unwrapped = await unwrapResult(wrapped);
	return mapToNode(unwrapped);
}
