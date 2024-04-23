import { createActor } from './actor.api';
import type { PostCircuit, _SERVICE } from 'declarations/canister.declarations';
import { ENV } from 'lib/constants';
import { canisterId } from './canisterIds';
import { mapToCircuit, unwrapResult } from 'lib/utils';
import { Circuit } from 'lib/types';

/**
 * Get circuit by id
 */
export async function getCircuit(circuitId: number): Promise<Circuit> {
	const actor = await createActor<_SERVICE>(canisterId[ENV], 'canister');
	const wrapped = await actor.get_circuit(circuitId);

	const unwrapped = await unwrapResult(wrapped);
	return mapToCircuit(unwrapped);
}

/**
 * Get the user circuits
 */
export async function getUserCircuits(): Promise<Circuit[]> {
	const actor = await createActor<_SERVICE>(canisterId[ENV], 'canister');
	const wrapped = await actor.get_user_circuits();

	const unwrapped = await unwrapResult(wrapped);
	return unwrapped.map(mapToCircuit).sort((a, b) => {
		// Sort on createdAt DESC
		return b.createdAt.getTime() - a.createdAt.getTime();
	});
}

/**
 * Add a new circuit
 */
export async function addCircuit(data: PostCircuit): Promise<Circuit> {
	const actor = await createActor<_SERVICE>(canisterId[ENV], 'canister');
	const wrapped = await actor.add_circuit(data);

	const unwrapped = await unwrapResult(wrapped);
	return mapToCircuit(unwrapped);
}

/**
 * Edit a circuit
 */
export async function editCircuit({ circuitId, data }: { circuitId: number; data: PostCircuit }): Promise<Circuit> {
	const actor = await createActor<_SERVICE>(canisterId[ENV], 'canister');
	const wrapped = await actor.edit_circuit(circuitId, data);

	const unwrapped = await unwrapResult(wrapped);
	return mapToCircuit(unwrapped);
}

/**
 * Toggle enabled/disabled state of a circuit
 */
export async function toggleStatus({ circuitId, enabled }: { circuitId: number; enabled: boolean }): Promise<Circuit> {
	const actor = await createActor<_SERVICE>(canisterId[ENV], 'canister');

	if (enabled) {
		const wrapped = await actor.disable_circuit(circuitId);

		const unwrapped = await unwrapResult(wrapped);
		return mapToCircuit(unwrapped);
	}

	const wrapped = await actor.enable_circuit(circuitId);

	const unwrapped = await unwrapResult(wrapped);
	return mapToCircuit(unwrapped);
}
