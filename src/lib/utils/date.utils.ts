import { getTime } from 'date-fns';
import { DateTime } from 'luxon';

export const toReadableDate = (
	date: Date,
	options?: {
		includeTime?: boolean;
	}
) => {
	return date.toLocaleDateString('en-us', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hourCycle: 'h23',
		hour: options?.includeTime ? '2-digit' : undefined,
		minute: options?.includeTime ? '2-digit' : undefined
	});
};

export function dateToNano(date: Date) {
	const value = getTime(date);
	return BigInt(value) * BigInt(1e6);
}

export function dateFromNano(nano: bigint) {
	const value = nano / BigInt(1e9);
	const date = DateTime.fromSeconds(Number(value));
	return date.toJSDate();
}
