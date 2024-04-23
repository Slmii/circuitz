import { HttpAgent, Actor as DfinityActor, ActorConfig } from '@dfinity/agent';
import { AuthClient, LocalStorage } from '@dfinity/auth-client';
import { IDL } from '@dfinity/candid';
import { HOST, II_AUTH } from 'lib/constants';
import { getDelegation } from 'lib/utils';
import { idlFactory as icIdl } from 'declarations/ic.declarations';
import { idlFactory as canisterIdl } from 'declarations/canister.declarations';

export type Controller = 'canister' | 'ic';

const idlFactoryMapping: Record<Controller, IDL.InterfaceFactory> = {
	canister: canisterIdl,
	ic: icIdl
};

/**
 * Get the auth client from Dfinity
 */
export async function getAuthClient() {
	return AuthClient.create({
		storage: new LocalStorage(II_AUTH),
		keyType: 'Ed25519',
		idleOptions: {
			disableDefaultIdleCallback: true,
			disableIdle: true
		}
	});
}

/**
 * Create an actor
 */
export async function createActor<T>(
	canisterId: string,
	controller: keyof typeof idlFactoryMapping,
	config?: Pick<ActorConfig, 'callTransform' | 'queryTransform'>
): Promise<T> {
	const identity = await getDelegation();

	// Actor for II
	const agent = new HttpAgent({
		host: HOST,
		identity
	});

	return new Promise<T>((resolve: (value: T) => void) => {
		resolve(
			DfinityActor.createActor(idlFactoryMapping[controller], {
				agent,
				canisterId,
				...config
			})
		);
	});
}
