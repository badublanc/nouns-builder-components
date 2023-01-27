export const logWarning = (type: string, collection: string, chain: string) => {
	console.warn(
		`BUILDER: ${type}. Double check that the collection address and chain are correct or retry the query.\n\ncollection: ${collection}\nchain: ${chain}`
	);
};

export const truncateAddress = (address: string) => {
	if (!address) return '';
	return address.substring(0, 6) + '...' + address.substring(address.length - 4);
};
