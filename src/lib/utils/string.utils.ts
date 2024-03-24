export const capitalizeFirstLetter = (value: string) => {
	return value.charAt(0).toUpperCase() + value.slice(1);
};

export const stringifyJson = (value: unknown) => {
	return JSON.stringify(value, null, 4);
};
