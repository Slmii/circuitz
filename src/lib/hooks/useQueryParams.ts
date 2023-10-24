import { useSearchParams } from 'react-router-dom';

export const useQueryParams = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const getParam = (key: string) => {
		return searchParams.get(key);
	};

	const getParams = (key: string) => {
		return searchParams.getAll(key);
	};

	const isInParams = (key: string, value: string) => {
		const entries = searchParams.getAll(key);
		return entries.includes(value);
	};

	/**
	 * Set multiple params with the same key
	 */
	const setParams = (key: string, value: string) => {
		const entries = searchParams.getAll(key);

		// Reset params
		searchParams.delete(key);

		// Check if the current value is already in the filters
		const isInEntries = entries.includes(value);

		if (!isInEntries) {
			// Append existing params
			entries.forEach(entry => searchParams.append(key, entry));
			// Add new param
			searchParams.append(key, value);
		} else {
			// Filter out existing param
			const newEntries = entries.filter(entry => entry !== value);
			// Append all params
			newEntries.forEach(entry => searchParams.append(key, entry));
		}

		setSearchParams(searchParams);
	};

	/**
	 * Set a single param
	 */
	const setParam = (key: string, value: string) => {
		const entries = [...searchParams.entries()];

		setSearchParams({
			// Append existing params so we don't lose them
			...Object.fromEntries(entries),
			[key]: value
		});
	};

	/**
	 * Remove a single param
	 */
	const removeParams = (key: string) => {
		searchParams.delete(key);
		setSearchParams(searchParams);
	};

	return {
		searchParams,
		setParams,
		setParam,
		getParam,
		getParams,
		isInParams,
		removeParams
	};
};
