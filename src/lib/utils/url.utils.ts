interface RowId {
	id: number;
}

/**
 * Get the full URL path to the current asset (including parent assets), in the correct order
 */
export const getUrlPathToAsset = <T extends RowId>(id: number, rows: T[]) => {
	const paths: T[] = [];

	const asset = rows.find(asset => asset.id === id);
	if (asset) {
		// Put at the front of the array for the correct order
		paths.unshift(asset);
	}

	return paths;
};

/**
 * Get breadcrumbs URL
 */
export const getUrlBreadcrumbs = <T extends RowId>(id: number, rows: T[]) => {
	return getUrlPathToAsset(id, rows)
		.map(asset => encodeURIComponent(asset.id))
		.join('/');
};
