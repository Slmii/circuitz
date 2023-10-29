import { createActor } from './actor.api';
import type { _SERVICE } from 'declarations/users.declarations';
import { unwrapResult } from 'lib/utils';
import { ENV } from 'lib/constants';
import { usersCanisterId } from './canisterIds';

/**
 * Get the user
 */
export async function getMe() {
	const actor = await createActor<_SERVICE>(usersCanisterId[ENV], 'users');
	return actor.get_user();
}

/**
 * Add user
 */
export async function addUser(username?: string) {
	const actor = await createActor<_SERVICE>(usersCanisterId[ENV], 'users');

	const response = await actor.create_user(username ? [username] : []);
	return unwrapResult(response);
}
