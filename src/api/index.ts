import * as actor from './actor.api';
import * as auth from './auth.api';
import * as users from './users.api';

export const api = {
	...actor,
	...auth,
	...users
};
