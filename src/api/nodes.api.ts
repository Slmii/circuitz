import { Actor } from './actor.api';
import type { LookupCanister, NodeType, _SERVICE } from 'declarations/nodes.declarations';
import { ENV } from 'lib/constants';
import { nodesCanisterId } from './canisterIds';
import { mapToNode, unwrapResult } from 'lib/utils';
import { Node } from 'lib/types';

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
	static async deleteNode(circuitId: number): Promise<Node> {
		const actor = await Actor.createActor<_SERVICE>(nodesCanisterId[ENV], 'nodes');

		const wrapped = await actor.delete_node(circuitId);
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
}
