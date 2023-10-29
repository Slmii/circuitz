import { HttpAgent, Actor as DfinityActor, ActorConfig } from '@dfinity/agent';
import { AuthClient, LocalStorage } from '@dfinity/auth-client';
import { IDL } from '@dfinity/candid';
import { HOST, II_AUTH } from 'lib/constants';
import { getDelegation } from 'lib/utils';
import { idlFactory as circuitsIdl } from 'declarations/circuits.declarations';
import { idlFactory as nodesIdl } from 'declarations/nodes.declarations';
import { idlFactory as usersIdl } from 'declarations/users.declarations';
import { idlFactory as icIdl } from 'declarations/ic.declarations';
import { idlFactory as tracesIdl } from 'declarations/traces.declarations';

export type Controller = 'circuits' | 'nodes' | 'users' | 'ic' | 'traces';

const idlFactoryMapping: Record<Controller, IDL.InterfaceFactory> = {
	circuits: circuitsIdl,
	nodes: nodesIdl,
	users: usersIdl,
	ic: icIdl,
	traces: tracesIdl
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
