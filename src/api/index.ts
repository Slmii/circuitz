import * as actor from './actor.api';
import * as users from './users.api';
import * as circuits from './circuits.api';
import * as nodes from './nodes.api';
import * as ic from './ic.api';
import * as traces from './traces.api';

export const api = {
	Actor: actor,
	Users: users,
	Circuits: circuits,
	IC: ic,
	Nodes: nodes,
	Traces: traces
};
