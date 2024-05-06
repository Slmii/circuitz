export const capitalizeFirstLetter = (value: string) => {
	return value.charAt(0).toUpperCase() + value.slice(1);
};

export const stringifyJson = (value: unknown) => {
	return JSON.stringify(value, null, 4);
};

export const parseJson = <T extends object>(value: string) => {
	try {
		return JSON.parse(value) as T;
	} catch (e) {
		console.log('Error parsing JSON: ', e);
		return {};
	}
};
