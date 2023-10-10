import * as actor from './actor.api';
import * as auth from './auth.api';
import * as users from './users.api';
import * as circuits from './circuits.api';
import * as nodes from './nodes.api';
import * as ic from './ic.api';

export const api = {
	...actor,
	...auth,
	...users,
	...circuits,
	...ic,
	...nodes
};
