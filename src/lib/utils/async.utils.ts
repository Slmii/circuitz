export function delay<T>(ms: number, callback: () => T): Promise<T> {
	return new Promise(resolve => setTimeout(() => resolve(callback()), ms));
}
