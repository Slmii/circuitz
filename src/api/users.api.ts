import { Actor } from './actor.api';
import type { _SERVICE } from 'declarations/users.declarations';
import { unwrapResult } from 'lib/utils';
import { ENV } from 'lib/constants';
import { usersCanisterId } from './canisterIds';

export abstract class Users {
	/**
	 * Get the user
	 */
	static async getMe() {
		const actor = await Actor.createActor<_SERVICE>(usersCanisterId[ENV], 'users');
		return actor.get_user();
	}

	/**
	 * Add user
	 */
	static async addUser(username?: string) {
		const actor = await Actor.createActor<_SERVICE>(usersCanisterId[ENV], 'users');

		const response = await actor.create_user(username ? [username] : []);
		return unwrapResult(response);
	}
}
