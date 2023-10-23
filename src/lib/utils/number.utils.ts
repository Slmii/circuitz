export const toReadableNumber = (number: number, options?: { decimals?: number; locale?: string }) => {
	return new Intl.NumberFormat(options?.locale ?? 'en-US', {
		minimumFractionDigits: options?.decimals ?? 0,
		maximumFractionDigits: options?.decimals ?? 0
	}).format(number);
};

export const formatBytes = (bytes: number, decimals = 2) => {
	if (!+bytes) {
		return '0 Bytes';
	}

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const formatTokenAmount = (value: string) => {
	return value.replace(/(\.\d{5})\d+/g, '$1');
};
