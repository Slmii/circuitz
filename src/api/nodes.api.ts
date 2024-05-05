import type {
	FilterPin,
	LookupCanister,
	LookupHttpRequest,
	MapperPin,
	NodeType,
	Pin,
	_SERVICE
} from 'declarations/nodes.declarations';
import { ENV } from 'lib/constants';
import { nodesCanisterId } from './canisterIds';
import {
	getFilterPinFormValues,
	getMapperPinFormValues,
	getPin,
	httpRequest,
	isFilterTrue,
	mapToNode,
	unwrapResult
} from 'lib/utils';
import { Node, SampleData } from 'lib/types';
import { createActor } from './actor.api';
import createMapper from 'map-factory';
import lodashMerge from 'lodash/merge';

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
	return actor.preview_lookup_canister(data);
}

/**
 * Preview Lookup HTTP Request
 */
export async function previewLookupHTTPRequest(data: LookupHttpRequest) {
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

export async function getSampleData(nodes: Node[]) {
	let sampleData: SampleData = {};

	for (const [index, node] of nodes.entries()) {
		const nodeIndex = index + 1;

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

		// Lookup Nodes
		if ('LookupCanister' in node.nodeType) {
			sampleData[`Node:${nodeIndex}`] = await previewLookupCanister(node.nodeType.LookupCanister);
		} else if ('LookupHttpRequest' in node.nodeType) {
			sampleData[`Node:${nodeIndex}`] = await httpRequest(node.nodeType.LookupHttpRequest);
		}

		// Pin that executes after the node and checks if the node should pass the data to the next node
		const lookupfilterPin = getPin<FilterPin>(node, 'LookupFilterPin');
		if (lookupfilterPin) {
			const filterPinFormValues = getFilterPinFormValues(lookupfilterPin);

			// If the lookup filter is not true, skip the merge data node
			const isTrue = isFilterTrue(filterPinFormValues);
			if (!isTrue) {
				// Remove the lookup data from the sample data
				delete sampleData[`Node:${nodeIndex}`];

				continue;
			}
		}

		const mapperPin = getPin<MapperPin>(node, 'MapperPin');
		if (mapperPin) {
			const mapperPinFormValues = getMapperPinFormValues(mapperPin);

			const mapper = createMapper();
			mapperPinFormValues.fields.forEach(field => {
				if (field.input.length && field.output.length) {
					const inputField = field.input.replace('[*]', '[]');
					const outputField = field.output.replace('[*]', '[]');

					mapper.map(inputField).to(outputField);
				}
			});

			const output = mapper.execute(sampleData);
			sampleData[`Node:${nodeIndex}`] = lodashMerge(sampleData[`Node:${nodeIndex}`], output);
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
