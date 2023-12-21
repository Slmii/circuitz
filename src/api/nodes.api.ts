import type { FilterPin, LookupCanister, NodeType, Pin, _SERVICE } from 'declarations/nodes.declarations';
import { ENV } from 'lib/constants';
import { nodesCanisterId } from './canisterIds';
import { getFilterPinFormValues, getPin, httpRequest, isFilterTrue, mapToNode, unwrapResult } from 'lib/utils';
import { Node, SampleData } from 'lib/types';
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
export async function previewLookupCanister(data: LookupCanister) {
	const actor = await createActor<_SERVICE>(nodesCanisterId[ENV], 'nodes');
	return actor.preview_lookup_request(data);
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
	const actor = await createActor<_SERVICE>(nodesCanisterId[ENV], 'nodes');

	const unwrapped = await actor.edit_order(nodeId, order);
	return unwrapResult(unwrapped);
}

export async function getSampleData(nodes: Node[]) {
	const sampleData: Record<'data', SampleData> = {
		data: {}
	};

	for (const [index, node] of nodes.entries()) {
		const nodeIndex = index + 1;

		// Skip disabled nodes
		if (!node.isEnabled) {
			continue;
		}

		// Input Nodes (Starting point)
		if ('Canister' in node.nodeType) {
			const sampleDataAsString = node.nodeType.Canister.sample_data[0] ? node.nodeType.Canister.sample_data[0] : '{}';
			sampleData.data = JSON.parse(sampleDataAsString);
		}

		if ('HttpRequest' in node.nodeType) {
			sampleData.data = await httpRequest(node.nodeType.HttpRequest);
		}
		// End Input Nodes

		// ==========

		// TODO: add all pins logic

		const filterPin = getPin<FilterPin>(node, 'FilterPin');
		if (filterPin) {
			const filterPinFormValues = getFilterPinFormValues(filterPin);

			// If the filter is not true, skip the node
			const isTrue = isFilterTrue(filterPinFormValues);
			if (!isTrue) {
				continue;
			}
		}

		if ('LookupCanister' in node.nodeType) {
			const lookupCanisterResponse = await previewLookupCanister(node.nodeType.LookupCanister);
			sampleData.data[`Node:${nodeIndex}`] = lookupCanisterResponse;
		} else if ('LookupHttpRequest' in node.nodeType) {
			sampleData.data[`Node:${nodeIndex}`] = await httpRequest(node.nodeType.LookupHttpRequest);
		}

		const lookupfilterPin = getPin<FilterPin>(node, 'LookupFilterPin');
		if (lookupfilterPin) {
			const filterPinFormValues = getFilterPinFormValues(lookupfilterPin);

			// If the lookup filter is not true, skip the merge data node
			const isTrue = isFilterTrue(filterPinFormValues);
			if (!isTrue) {
				// Remove the lookup data from the sample data
				delete sampleData.data[`Node:${nodeIndex}`];

				continue;
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
 * Edit a pin
 */
export async function editPin({ nodeId, data }: { nodeId: number; data: Pin }): Promise<Node> {
	const actor = await createActor<_SERVICE>(nodesCanisterId[ENV], 'nodes');

	const wrapped = await actor.edit_pin(nodeId, data);
	const unwrapped = await unwrapResult(wrapped);
	return mapToNode(unwrapped);
}
