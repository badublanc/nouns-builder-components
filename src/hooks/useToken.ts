import type { Network } from '../types';
import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { useContractRead } from 'wagmi';
import { TokenABI } from '../abis';
import { getChainIdFromNetwork } from '../utils';

interface UseTokenConfig {
	tokenId: number;
	tokenAddress: string;
	network?: Network;
}

export const useToken = ({
	tokenId,
	tokenAddress,
	network = 'mainnet',
}: UseTokenConfig) => {
	const [uri, setUri] = useState<Record<string, any>>({});
	const [name, setName] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [imageUrl, setImageUrl] = useState<string>('');
	const [traits, setTraits] = useState<Record<string, any>>({});

	const resetValues = () => {
		setName('');
		setDescription('');
		setImageUrl('');
		setTraits({});
	};

	useContractRead({
		address: tokenAddress as `0x$string}`,
		chainId: getChainIdFromNetwork(network),
		abi: TokenABI,
		functionName: 'tokenURI',
		args: [BigNumber.from(tokenId || '0')],
		enabled: Boolean(tokenAddress && Number.isInteger(tokenId)),
		onSuccess(data) {
			const uri = window.atob(data.split(',')[1]);
			if (uri) setUri(JSON.parse(uri));
			else setUri({});
		},
		onError(err) {
			console.error(err);
			setUri({});
		},
	});

	useEffect(() => {
		const { name, description, image, properties } = uri;

		if (name) setName(name);
		else setName('');

		if (description) setDescription(description);
		else setDescription('');

		if (image) setImageUrl(image);
		else setImageUrl('');

		if (properties) setTraits(properties);
		else setTraits({});

		return () => resetValues();
	}, [uri]);

	return { tokenId, name, description, imageUrl, traits };
};
