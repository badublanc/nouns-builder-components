import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export const logWarning = (type: string, collection: string, chain: string = 'MAINNET') => {
	console.warn(
		`BUILDER: ${type}. Double check that the collection address and chain are correct or retry the query.\n\ncollection: ${collection}\nchain: ${chain}`
	);
};

export const trunc = (address: string) => {
	if (!address) return '';
	return address.substring(0, 6) + '...' + address.substring(address.length - 4);
};

export const fetchEnsData = async (address: string) => {
	if (!address) return {};
	try {
		const response = await fetch('https://api.ensideas.com/ens/resolve/' + address);
		const data = await response.json();
		return data;
	} catch (err) {
		console.error(err);
		return {};
	}
};

export const relative = (timestamp: number) => {
	if (!timestamp) return '';
	return dayjs.unix(timestamp / 1000).fromNow(false);
};
