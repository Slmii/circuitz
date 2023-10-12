import { Actor } from './actor.api';
import type { NodeType, _SERVICE } from 'declarations/nodes.declarations';
import { ENV } from 'lib/constants/env.constants';
import { nodesCanisterId } from './canisterIds';
import { unwrapResult } from 'lib/utils/actor.utils';
import { mapToNode } from 'lib/utils/nodes.utilts';
import { Node } from 'lib/types';
import { Principal } from '@dfinity/principal';

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
	 * Get the Node Canister Ids for a circuit
	 */
	static async getNodeCanisterId(): Promise<Principal> {
		const actor = await Actor.createActor<_SERVICE>(nodesCanisterId[ENV], 'nodes');

		const wrapped = await actor.get_node_canister_id();
		return unwrapResult(wrapped);
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
}
