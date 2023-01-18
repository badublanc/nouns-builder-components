import type { Network } from '../types';

export const truncateAddress = (address: string) => {
	if (!address) return '';
	return (
		address.substring(0, 6) + '...' + address.substring(address.length - 4)
	);
};

export const getChainIdFromNetwork = (network: Network) => {
	return network === 'mainnet' ? 1 : 5;
};
