import { createActor } from './actor.api';
import { Principal } from '@dfinity/principal';
import { _SERVICE } from 'declarations/ic.declarations';
import { toStatus, transform, toPrincipal, getDelegation } from 'lib/utils';
import { MANAGEMENT_CANISTER_ID } from './canisterIds';
import { ic } from 'ic0';
import { Actor, ActorSubclass, HttpAgent, fetchCandid } from '@dfinity/agent';
import { HOST } from 'lib/constants';
import { IDL } from '@dfinity/candid';

/**
 * Get the status of a canister
 */
export async function getCanisterStatus(canisterId: Principal) {
	const actor = await createActor<_SERVICE>(MANAGEMENT_CANISTER_ID, 'ic', {
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

/**
 * Fetch Candid and convert it to JS
 */
export async function didToJs(canisterId: string) {
	const identity = await getDelegation();
	const agent = new HttpAgent({
		host: HOST,
		identity
	});

	const candid = await fetchCandid(canisterId, agent);

	const didToJs = async (candid_source: string) => {
		// call didjs canister
		const didjs_interface: IDL.InterfaceFactory = ({ IDL }) =>
			IDL.Service({
				did_to_js: IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], ['query'])
			});

		const candidCanister = `a4gq6-oaaaa-aaaab-qaa4q-cai`;

		const didjs: ActorSubclass = Actor.createActor(didjs_interface, {
			agent,
			canisterId: candidCanister
		});

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const js: any = await didjs.did_to_js(candid_source);
		if (Array.isArray(js) && js.length === 0) {
			return undefined;
		}

		return js[0];
	};

	return didToJs(candid) as Promise<string>;
}
