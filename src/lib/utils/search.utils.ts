export type NestedKeyOf<ObjectType extends object> = {
	[Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
		? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
		: `${Key}`;
}[keyof ObjectType & (string | number)];

export const searchInArrayOfObjects = <T extends object>(array: T[], key: NestedKeyOf<T> & string, query: string) => {
	if (query.length) {
		return array.filter(item => {
			const keys = key.split('.');

			let result = item;
			if (keys.length > 1) {
				for (const key of keys) {
					result = result[key as keyof T] as T;
				}

				return result.toString().toLowerCase().includes(query.toLowerCase());
			} else {
				return (item[keys[0] as keyof T] as T).toString().toLowerCase().includes(query.toLowerCase());
			}
		});
	}

	return array;
};
