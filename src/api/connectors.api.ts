import { createActor } from './actor.api';
import type { PostConnector, _SERVICE } from 'declarations/canister.declarations';
import { ENV } from 'lib/constants';
import { canisterId } from './canisterIds';
import { mapToConnector, unwrapResult } from 'lib/utils';
import { Connector } from 'lib/types';

/**
 * Get the list of connectors for the current user.
 */
export async function getUserConnectors(): Promise<Connector[]> {
	const actor = await createActor<_SERVICE>(canisterId[ENV], 'canister');
	const wrapped = await actor.get_user_connectors();

	const unwrapped = await unwrapResult(wrapped);
	return unwrapped.map(mapToConnector);
}

/**
 * Add a connector for the current user.
 */
export async function addConnector(data: PostConnector): Promise<Connector> {
	const actor = await createActor<_SERVICE>(canisterId[ENV], 'canister');

	const wrapped = await actor.add_connector(data);
	const unwrapped = await unwrapResult(wrapped);
	return mapToConnector(unwrapped);
}

/**
 * Edit a connector for the current user.
 */
export async function editConnector({
	connectorId,
	data
}: {
	connectorId: number;
	data: PostConnector;
}): Promise<Connector> {
	const actor = await createActor<_SERVICE>(canisterId[ENV], 'canister');

	const wrapped = await actor.edit_connector(connectorId, data);
	const unwrapped = await unwrapResult(wrapped);
	return mapToConnector(unwrapped);
}
