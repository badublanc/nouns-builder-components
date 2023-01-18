import type { Network } from '../types';
import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { useContract, useProvider } from 'wagmi';
import { TokenABI } from '../abis';

interface UseTokenConfig {
	id: number;
	tokenAddress: string;
	network?: Network;
}

export const useToken = ({
	id,
	tokenAddress,
	network = 'mainnet',
}: UseTokenConfig) => {
	const provider = useProvider();
	const [imageUrl, setImageUrl] = useState('');

	const contract = useContract({
		address: tokenAddress as `0x${string}`,
		abi: TokenABI,
		signerOrProvider: provider,
	});

	useEffect(() => {
		const getUriData = async (tokenId: number) => {
			const id = BigNumber.from(tokenId);
			const data = await contract?.tokenURI(id);
			if (data) {
				const uri = window.atob(data.split(',')[1]);
				const { image } = JSON.parse(uri);
				if (image) setImageUrl(image);
				else setImageUrl('');
			} else setImageUrl('');
		};

		if (id) {
			getUriData(id);
		}

		return () => setImageUrl('');
	}, [id, contract]);

	return { id, imageUrl };
};
