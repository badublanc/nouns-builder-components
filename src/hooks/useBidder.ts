import type { Provider } from '@wagmi/core';
import { useEffect, useState } from 'react';
import { useProvider } from 'wagmi';

type Props = {
	address: string;
};

const useBidder = ({ address }: Props) => {
	const provider = useProvider();
	const [ens, setEns] = useState<string>('');
	const [avatar, setAvatar] = useState<string>('');

	useEffect(() => {
		const getEns = async (address: string, provider: Provider) => {
			const ens = await provider.lookupAddress(address);
			if (ens) setEns(ens);
			else setEns('');
		};

		if (address) getEns(address, provider);
		else setEns('');
	}, [address, provider]);

	useEffect(() => {
		const getAvatar = async (name: string, provider: Provider) => {
			const avatar = await provider.getAvatar(name);
			if (avatar) setAvatar(avatar);
			else setAvatar('');
		};

		if (ens) getAvatar(ens, provider);
		else setAvatar('');
	}, [ens, provider]);

	return { bidder: ens || truncateAddress(address), avatar };
};

const truncateAddress = (address: string) => {
	return (
		address.substring(0, 6) + '...' + address.substring(address.length - 4)
	);
};

export default useBidder;
