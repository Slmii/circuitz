import { Principal } from '@dfinity/principal';
import { CanisterStatus } from 'lib/types';
import { toReadableNumber } from './number.utils';
import { toPrincipal } from './identity.utils';

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
