import { Identity } from '@dfinity/agent';
import { LocalStorage } from '@dfinity/auth-client';
import { dateFromNano } from './date.utils';
import { getLocalStorageIdentity } from './identity.utils';
import { ApiError } from 'declarations/circuits.declarations';
import { ACTOR, PROVIDER } from 'lib/constants';

export const actorLocalStorage = new LocalStorage(`${ACTOR}-`);

export const getLocalStorageProvider = async () => await actorLocalStorage.get(PROVIDER);

export const getDelegation = async () => {
	let identity: Identity | undefined = undefined;

	try {
		identity = await getLocalStorageIdentity();

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const identityExpiration = identity?._delegation.delegations[0].delegation.expiration as bigint | undefined;

		if (identityExpiration) {
			if (dateFromNano(identityExpiration) < new Date()) {
				identity = undefined;
			}
		} else {
			identity = undefined;
		}
	} catch (error) {
		identity = undefined;
	}

	return identity;
};

export const unwrapResult = <T, E = ApiError>(result: { Ok: T } | { Err: E }): Promise<T> => {
	return new Promise((resolve: (value: T) => void, reject: (error: E) => void) => {
		if ('Ok' in result) {
			resolve(result.Ok);
		} else {
			console.trace('error', result);
			reject(result.Err);
		}
	});
};
