import { HttpAgent, Actor as DfinityActor } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { IDL } from '@dfinity/candid';
import { HOST } from 'lib/constants/env.constants';
import { idlFactory as circuitsIdl } from 'declarations/circuits';
import { idlFactory as nodesIdl } from 'declarations/nodes';
import { idlFactory as usersIdl } from 'declarations/users';

export type Controller = 'circuits' | 'nodes' | 'users';

const idlFactoryMapping: Record<Controller, IDL.InterfaceFactory> = {
	circuits: circuitsIdl,
	nodes: nodesIdl,
	users: usersIdl
};

export abstract class Actor {
	/**
	 * Get the auth client from Dfinity
	 */
	static async getAuthClient() {
		return AuthClient.create({
			idleOptions: {
				disableDefaultIdleCallback: true,
				disableIdle: true
			}
		});
	}

	/**
	 * Create an actor
	 */
	static async createActor<T>(canisterId: string, controller: keyof typeof idlFactoryMapping): Promise<T> {
		const authClient = await this.getAuthClient();

		// Actor for II
		const agent = new HttpAgent({
			host: HOST,
			identity: authClient.getIdentity()
		});

		return new Promise<T>((resolve: (value: T) => void) => {
			resolve(
				DfinityActor.createActor(idlFactoryMapping[controller], {
					agent,
					canisterId
				})
			);
		});
	}
}
