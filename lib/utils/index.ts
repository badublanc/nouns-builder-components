export const logWarning = (type: string, collection: string, chain: string) => {
	console.warn(
		`BUILDER: ${type}. Double check that the collection address and chain are correct.\n\ncollection: ${collection}\nchain: ${chain}`
	);
};

export const truncateAddress = (address: string) => {
	if (!address) return '';
	return address.substring(0, 6) + '...' + address.substring(address.length - 4);
};

export const fetchDataWithQuery = async (query: string, variables: Record<string, any> = {}) => {
	try {
		const response = await fetch('https://api.zora.co/graphql', {
			method: 'post',
			headers: { 'Content-Type': 'application/json; charset=utf-8' },
			body: JSON.stringify({ query, variables }),
		});
		return await response.json();
	} catch (err) {
		console.error(err);
		return null;
	}
};

export const fetchDataWithQueries = async (
	queries: string[],
	variables: Record<string, any> = {}
) => {
	return await Promise.all(
		queries.map(async (query) => {
			return await fetchDataWithQuery(query, variables);
		})
	);
};
