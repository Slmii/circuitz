import { Actor } from './actor.api';
import type { _SERVICE } from 'declarations/traces.declarations';
import { ENV } from 'lib/constants';
import { tracesCanisterId } from './canisterIds';
import { unwrapResult } from 'lib/utils/actor.utils';
import { Trace } from 'lib/types';
import { mapToTrace } from 'lib/utils/traces.utilts';

export abstract class Traces {
	/**
	 * Get the Nodes for a circuit
	 */
	static async getTraces(circuitId: number): Promise<Trace[]> {
		const actor = await Actor.createActor<_SERVICE>(tracesCanisterId[ENV], 'traces');
		const wrapped = await actor.get_circuit_traces(circuitId);

		const unwrapped = await unwrapResult(wrapped);
		return unwrapped.map(mapToTrace);
	}
}
