import { DelegationChain, DelegationIdentity, Ed25519KeyIdentity } from '@dfinity/identity';
import { Identity } from '@dfinity/agent';
import { DELEGATION, IDENTITY, II_AUTH } from 'lib/constants/local-storage.constants';
import { getLocalStorageItem } from './local-storage.utils';
import { Principal } from '@dfinity/principal';

/**
 * Get the identity from local storage
 */
export async function getLocalStorageIdentity(): Promise<Identity> {
	const identityKey = await getLocalStorageItem(II_AUTH, IDENTITY);
	const delegationChain = await getLocalStorageItem(II_AUTH, DELEGATION);

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
