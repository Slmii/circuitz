import { Actor } from './actor.api';
import type { LookupCanister, NodeType, _SERVICE } from 'declarations/nodes.declarations';
import { ENV } from 'lib/constants';
import { nodesCanisterId } from './canisterIds';
import { mapToNode, unwrapResult } from 'lib/utils';
import { Node, SampleDataOptions } from 'lib/types';

// TODO: replace hardcoded canister id with a dynamic one

export abstract class Nodes {
	/**
	 * Get the Nodes for a circuit
	 */
	static async getNodes(circuitId: number): Promise<Node[]> {
		const actor = await Actor.createActor<_SERVICE>(nodesCanisterId[ENV], 'nodes');
		const wrapped = await actor.get_circuit_nodes(circuitId);

		const unwrapped = await unwrapResult(wrapped);
		return unwrapped[1].map(mapToNode);
	}

	/**
	 * Delete a node from a circuit
	 */
	static async deleteNode(nodeId: number): Promise<Node> {
		const actor = await Actor.createActor<_SERVICE>(nodesCanisterId[ENV], 'nodes');

		const wrapped = await actor.delete_node(nodeId);
		const unwrapped = await unwrapResult(wrapped);
		return mapToNode(unwrapped);
	}

	/**
	 * Add a node to a circuit
	 */
	static async addNode({ circuitId, data }: { circuitId: number; data: NodeType }): Promise<Node> {
		const actor = await Actor.createActor<_SERVICE>(nodesCanisterId[ENV], 'nodes');

		const wrapped = await actor.add_node(circuitId, data);
		const unwrapped = await unwrapResult(wrapped);
		return mapToNode(unwrapped);
	}

	/**
	 * Edit a node
	 */
	static async editNode({ nodeId, data }: { nodeId: number; data: NodeType }): Promise<Node> {
		const actor = await Actor.createActor<_SERVICE>(nodesCanisterId[ENV], 'nodes');

		const wrapped = await actor.edit_node(nodeId, data);
		const unwrapped = await unwrapResult(wrapped);
		return mapToNode(unwrapped);
	}

	/**
	 * Preview Lookup Canister request
	 */
	static async previewLookupCanister(data: LookupCanister) {
		const actor = await Actor.createActor<_SERVICE>(nodesCanisterId[ENV], 'nodes');
		return actor.preview_lookup_request(data);
	}

	static async getSampleData(nodes: Node[], currentNode: number, options?: SampleDataOptions) {
		const sampleData: Record<string, unknown> = {};
		// Only executes nodes that are before the start node
		const nodesToExecute = nodes.filter(node => currentNode < node.id);

		for (const node of nodesToExecute) {
			// Input Nodes (Starting point )
			if ('Canister' in node.nodeType) {
				const sampleDataAsString = node.nodeType.Canister.sample_data[0] ? node.nodeType.Canister.sample_data[0] : '{}';
				sampleData['data'] = JSON.parse(sampleDataAsString);
			}

			if ('HttpRequest' in node.nodeType) {
				const requestBodyAsString = node.nodeType.HttpRequest.request_body[0]
					? node.nodeType.HttpRequest.request_body[0]
					: '{}';

				const headers = node.nodeType.HttpRequest.headers.reduce(
					(acc, header) => {
						acc[header[0]] = header[1];
						return acc;
					},
					{} as Record<string, string>
				);

				try {
					const response = await fetch(node.nodeType.HttpRequest.url, {
						method: 'GET' in node.nodeType.HttpRequest.method ? 'GET' : 'POST',
						body: JSON.parse(requestBodyAsString),
						headers
					});
					const data = await response.json();
					sampleData['data'] = data;
				} catch (error) {
					sampleData['data'] = error as Record<string, unknown>;
				}
			}
			// End Input Nodes

			// Do not execute the node itself if
			// - The preview is for the filter, and
			// - The node is the current node, or
			// - The current node is not defined (meaning the node is not saved yet)
			if (options?.isFilterPreview && (!currentNode || currentNode === node.id)) {
				// Break out
				break;
			}

			if ('LookupCanister' in node.nodeType) {
				const lookupCanisterResponse = await this.previewLookupCanister(node.nodeType.LookupCanister);
				sampleData['LookupCanister'] = lookupCanisterResponse;
			}

			if ('LookupHttpRequest' in node.nodeType) {
				const requestBodyAsString = node.nodeType.LookupHttpRequest.request_body[0]
					? node.nodeType.LookupHttpRequest.request_body[0]
					: '{}';

				const headers = node.nodeType.LookupHttpRequest.headers.reduce(
					(acc, header) => {
						acc[header[0]] = header[1];
						return acc;
					},
					{} as Record<string, string>
				);

				const response = await fetch(node.nodeType.LookupHttpRequest.url, {
					method: 'GET' in node.nodeType.LookupHttpRequest.method ? 'GET' : 'POST',
					body: JSON.parse(requestBodyAsString),
					headers
				});
				const data = await response.json();

				sampleData['LookupHttpRequest'] = data;
			}

			if ('Transformer' in node.nodeType) {
				// TODO
			}

			if ('Mapper' in node.nodeType) {
				// TODO
			}
		}

		return sampleData;
	}
}
