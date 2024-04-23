import { createActor } from './actor.api';
import { Principal } from '@dfinity/principal';
import { _SERVICE } from 'declarations/ic.declarations';
import { toStatus, transform, toPrincipal } from 'lib/utils';
import { MANAGEMENT_CANISTER_ID } from './canisterIds';
import { ic } from 'ic0';
import { memo } from 'react';

/**
 * Get the status of a canister
 */
export async function getCanisterStatus(canisterId: Principal) {
	// const actor = await createActor<_SERVICE>(MANAGEMENT_CANISTER_ID, 'ic', {
	// 	callTransform: transform,
	// 	queryTransform: transform
	// });

	// const { status, ...rest } = await actor.canister_status({
	// 	canister_id: canisterId
	// });

	return {
		// TODO
		// status: toStatus(status),
		// ...rest
		status: 'running',
		cycles: 0n,
		idle_cycles_burned_per_day: 0n,
		memory_size: 0n,
		module_hash: []
	};
}

/**
 * Stop a canister
 */
export async function canisterStop(canisterId: string) {
	const actor = await createActor<_SERVICE>(MANAGEMENT_CANISTER_ID, 'ic');
	return actor.stop_canister({ canister_id: toPrincipal(canisterId) });
}

/**
 * Start a canister
 */
export async function canisterStart(canisterId: string) {
	const actor = await createActor<_SERVICE>(MANAGEMENT_CANISTER_ID, 'ic');
	return actor.start_canister({ canister_id: toPrincipal(canisterId) });
}

/**
 * Canister Call
 */
export async function call({
	args,
	canisterId,
	methodName
}: {
	canisterId: string;
	methodName: string;
	args: unknown[];
}) {
	const canister = ic(canisterId);
	return canister.call(methodName, ...args);
}
