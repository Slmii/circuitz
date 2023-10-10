import { Actor } from './actor.api';
import type { _SERVICE } from 'declarations/nodes.declarations';
import { ENV } from 'lib/constants/env.constants';
import { nodesCanisterId } from './canisterIds';
import { unwrapResult } from 'lib/utils/actor.utils';
import { mapToNode } from 'lib/utils/nodes.utilts';
import { NodesList } from 'lib/types';

export abstract class Nodes {
	/**
	 * Get the Nodes for a circuit
	 */
	static async getNodes(circuitId: number): Promise<NodesList> {
		const actor = await Actor.createActor<_SERVICE>(nodesCanisterId[ENV], 'nodes');
		const wrapped = await actor.get_circuit_nodes(circuitId);

		const unwrapped = await unwrapResult(wrapped);
		return {
			principal: unwrapped[0],
			nodes: unwrapped[1].map(mapToNode)
		};
	}
}
