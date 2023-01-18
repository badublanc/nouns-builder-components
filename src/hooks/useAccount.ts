import type { Network } from '../types';
import type { Provider } from '@wagmi/core';
import { useState, useEffect } from 'react';
import { useProvider } from 'wagmi';
import { truncateAddress } from '../utils';

interface UseAccountConfig {
	address: string;
	network?: Network;
}

export function useAccount({ address, network = 'mainnet' }: UseAccountConfig) {
	const provider = useProvider();
	const [ens, setEns] = useState<string>('');
	const [avatar, setAvatar] = useState<string>('');
	const [shortAddress, setShortAddress] = useState<string>('');

	useEffect(() => {
		const getEns = async (address: string, provider: Provider) => {
			const ens = await provider.lookupAddress(address);
			if (ens) setEns(ens);
			else setEns('');
		};

		if (address) getEns(address, provider);
		else setEns('');

		return () => setEns('');
	}, [address, provider]);

	useEffect(() => {
		const getAvatar = async (name: string, provider: Provider) => {
			const avatar = await provider.getAvatar(name);
			if (avatar) setAvatar(avatar);
			else setAvatar('');
		};

		if (ens) getAvatar(ens, provider);
		else setAvatar('');

		return () => setAvatar('');
	}, [ens, provider]);

	useEffect(() => {
		if (address) setShortAddress(truncateAddress(address));
		else setShortAddress('');

		return () => setShortAddress('');
	}, [address]);

	return {
		displayName: ens || shortAddress,
		address,
		shortAddress,
		avatar,
	};
}
