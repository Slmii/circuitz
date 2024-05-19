import { Principal } from '@dfinity/principal';
import { CanisterStatus } from 'lib/types';
import { toReadableNumber } from './number.utils';
import { Identity } from '@dfinity/agent';
import { LocalStorage } from '@dfinity/auth-client';
import { dateFromNano } from './date.utils';
import { ApiError } from 'declarations/canister.declarations';
import { ACTOR, PROVIDER } from 'lib/constants';
import { DelegationChain, DelegationIdentity, Ed25519KeyIdentity } from '@dfinity/identity';
import { DELEGATION, IDENTITY, II_AUTH } from 'lib/constants';

export const actorLocalStorage = new LocalStorage(`${ACTOR}-`);
export const getLocalStorageProvider = async () => await actorLocalStorage.get(PROVIDER);

/**
 * Get the identity from local storage
 */
export async function getLocalStorageIdentity(): Promise<Identity> {
	const storage = new LocalStorage(II_AUTH);

	const identityKey = await storage.get(IDENTITY);
	const delegationChain = await storage.get(DELEGATION);

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const chain = DelegationChain.fromJSON(delegationChain!);
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const key = Ed25519KeyIdentity.fromJSON(identityKey!);

	const identity: Identity = DelegationIdentity.fromDelegation(key, chain);

	return identity;
}

interface ValidateSession {
	/**
	 * Callback to execute when session is still valid
	 */
	onSuccess: (principal: Principal) => void;
	/**
	 * Callback to execute when session is not valid
	 */
	onInvalidSession: (error?: Error) => void;
}

/**
 * Validate the current identity from local storage.
 */
export const validateIdentity = async ({ onSuccess, onInvalidSession }: ValidateSession) => {
	try {
		const identity = await getLocalStorageIdentity();

		if (!identity) {
			return onInvalidSession();
		}

		const principal = identity.getPrincipal();
		return onSuccess(principal);
	} catch (error) {
		return onInvalidSession(error as Error);
	}
};

export const fromHexString = (hex: string) => {
	if (hex.substr(0, 2) === '0x') {
		hex = hex.substr(2);
	}
	const bytes = [];

	for (let c = 0; c < hex.length; c += 2) {
		bytes.push(parseInt(hex.substr(c, 2), 16));
	}

	return bytes;
};

/**
 * Generate an identity from a seed.
 */
export const generateIdentity = (seed: string | Uint8Array) => {
	return Ed25519KeyIdentity.generate(typeof seed === 'string' ? new Uint8Array(fromHexString(seed)) : seed);
};

export const toPrincipal = (principal: string) => {
	return typeof principal === 'string' ? Principal.fromText(principal) : principal;
};

export const isPrincipalEqual = (principalA: Principal, principalB: Principal) => {
	return principalA?.toString() === principalB?.toString();
};

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

export const toStatus = (status: { stopped: null } | { stopping: null } | { running: null }): CanisterStatus =>
	'stopped' in status && status.stopped === null
		? 'stopped'
		: 'stopping' in status && status.stopping === null
		? 'stopping'
		: 'running';

export const transform = (_methodName: string, args: unknown[]): { effectiveCanisterId: Principal } => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const first = args[0] as any;
	let effectiveCanisterId = toPrincipal('aaaaa-aa');
	if (first && typeof first === 'object' && first.canister_id) {
		effectiveCanisterId = Principal.from(first.canister_id as unknown);
	}

	return { effectiveCanisterId };
};

const ONE_TRILLION = 1_000_000_000_000;
export const formatTCycles = (cycles: bigint): string =>
	toReadableNumber(Number(cycles) / Number(ONE_TRILLION), {
		decimals: 2
	});

export function replaceBigIntWithNumber(obj: bigint): number;
export function replaceBigIntWithNumber(obj: bigint[]): number[];
export function replaceBigIntWithNumber<T>(obj: T): T;
export function replaceBigIntWithNumber<T>(obj: T): T | number | number[] {
	if (typeof obj === 'bigint') {
		return Number(obj) as number;
	}

	if (Array.isArray(obj)) {
		return obj.map(replaceBigIntWithNumber) as number[];
	}

	if (typeof obj === 'object' && obj !== null) {
		const newObj = {} as Record<keyof T, unknown>;

		for (const key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				newObj[key] = replaceBigIntWithNumber(obj[key]);
			}
		}

		return newObj as T;
	}

	return obj;
}
