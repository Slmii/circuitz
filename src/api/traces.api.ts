import { createActor } from './actor.api';
import type { _SERVICE } from 'declarations/canister.declarations';
import { ENV } from 'lib/constants';
import { canisterId } from './canisterIds';
import { mapToTrace, unwrapResult } from 'lib/utils';
import { Trace } from 'lib/types';

/**
 * Get the Nodes for a circuit
 */
export async function getTraces(circuitId: number): Promise<Trace[]> {
	const actor = await createActor<_SERVICE>(canisterId[ENV], 'canister');
	const wrapped = await actor.get_circuit_traces(circuitId);

	const unwrapped = await unwrapResult(wrapped);
	return unwrapped.map(mapToTrace);
}
