import { Actor } from './actor.api';
import type { PostCircuit, _SERVICE } from 'declarations/circuits.declarations';
import { ENV } from 'lib/constants/env.constants';
import { circuitsCanisterId } from './canisterIds';
import { unwrapResult } from 'lib/utils/actor.utils';
import { mapToCircuit } from 'lib/utils/circuits.utilts';
import { Circuit } from 'lib/types';

export abstract class Circuits {
	/**
	 * Get the user circuits
	 */
	static async getUserCircuits(): Promise<Circuit[]> {
		const actor = await Actor.createActor<_SERVICE>(circuitsCanisterId[ENV], 'circuits');
		const wrapped = await actor.get_user_circuits();

		const unwrapped = await unwrapResult(wrapped);
		return unwrapped.map(mapToCircuit);
	}

	/**
	 * Add a new circuit
	 */
	static async addCircuit(data: PostCircuit): Promise<Circuit> {
		const actor = await Actor.createActor<_SERVICE>(circuitsCanisterId[ENV], 'circuits');
		const wrapped = await actor.add_circuit(data);

		const unwrapped = await unwrapResult(wrapped);
		return mapToCircuit(unwrapped);
	}
}