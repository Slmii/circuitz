import { getTime, format, differenceInYears, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
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

/**
 * Format a date to a human readable string
 *
 * @param stamp the date to format
 * @returns a human readable string
 */
export const formatTimeDifference = (stamp: number | Date) => {
	const current = new Date();
	const compare = new Date(stamp);

	if (differenceInYears(current, compare) > 0) {
		return format(compare, 'MMM dd yyyy');
	} else {
		if (differenceInDays(current, compare) > 6) {
			return format(compare, 'MMM dd');
		} else {
			if (differenceInDays(current, compare) > 0) {
				return `${differenceInDays(current, compare)}d ago`;
			} else {
				if (differenceInHours(current, compare) > 0) {
					return `${differenceInHours(current, compare)}h ago`;
				} else {
					if (differenceInMinutes(current, compare) > 0) {
						return `${differenceInMinutes(current, compare)}m ago`;
					} else {
						return 'now';
					}
				}
			}
		}
	}
};
