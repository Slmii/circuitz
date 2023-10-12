import { Actor } from './actor.api';
import { Principal } from '@dfinity/principal';
import { _SERVICE } from 'declarations/ic.declarations';
import { toStatus, transform } from 'lib/utils/ic.utils';
import { MANAGEMENT_CANISTER_ID } from './canisterIds';
import { toPrincipal } from 'lib/utils/identity.utils';

export abstract class IC {
	/**
	 * Get the status of a canister
	 */
	static async getCanisterStatus(canisterId: Principal) {
		const actor = await Actor.createActor<_SERVICE>(MANAGEMENT_CANISTER_ID, 'ic', {
			callTransform: transform,
			queryTransform: transform
		});

		const { status, ...rest } = await actor.canister_status({
			canister_id: canisterId
		});

		return {
			status: toStatus(status),
			...rest
		};
	}

	/**
	 * Stop a canister
	 */
	static async canisterStop(canisterId: string) {
		const actor = await Actor.createActor<_SERVICE>(MANAGEMENT_CANISTER_ID, 'ic');
		return actor.stop_canister({ canister_id: toPrincipal(canisterId) });
	}

	/**
	 * Start a canister
	 */
	static async canisterStart(canisterId: string) {
		const actor = await Actor.createActor<_SERVICE>(MANAGEMENT_CANISTER_ID, 'ic');
		return actor.start_canister({ canister_id: toPrincipal(canisterId) });
	}
}
