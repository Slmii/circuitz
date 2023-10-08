import { LocalStorage } from '@dfinity/auth-client';

export const getLocalStorageItem = async (prefix: string, key: string) => {
	const storage = new LocalStorage(prefix);
	return storage.get(key);
};

export const setLocalStorageItem = async (prefix: string, key: string, value: string) => {
	const storage = new LocalStorage(prefix);
	return storage.set(key, value);
};

export const removeLocalStorageItem = async (prefix: string, key: string) => {
	const storage = new LocalStorage(prefix);
	return storage.remove(key);
};
