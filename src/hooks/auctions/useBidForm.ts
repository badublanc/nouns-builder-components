import type { Network } from '../../types';
import { usePrepareContractWrite, useContractWrite } from 'wagmi';
import { useEffect, useState } from 'react';
import { BigNumber, utils } from 'ethers';
import { AuctionABI } from '../../abis';
import { getChainIdFromNetwork } from '../../utils';
const { parseEther } = utils;

interface UseBidFormConfig {
	tokenId: number;
	bidAmount: string;
	minBid: string;
	auctionAddress: string;
	network?: Network;
}

export const useBidForm = ({
	tokenId,
	bidAmount,
	auctionAddress,
	minBid,
	network = 'mainnet',
}: UseBidFormConfig) => {
	const [isValidBid, setIsValidBid] = useState<boolean>(false);
	const parseTokenId = (id: number) => {
		if (!id) return BigNumber.from(0);
		return BigNumber.from(id);
	};

	const { config, error } = usePrepareContractWrite({
		address: auctionAddress as `0x${string}`,
		chainId: getChainIdFromNetwork(network),
		abi: AuctionABI,
		functionName: 'createBid',
		args: [parseTokenId(tokenId)],
		enabled: isValidBid,
		overrides: {
			value: parseEther(bidAmount || '0'),
		},
		onError(err) {
			console.error(err);
		},
	});

	const { data, isLoading, isSuccess, write } = useContractWrite(config);

	useEffect(() => {
		if (tokenId && bidAmount && minBid) {
			const isValidToken = Number.isInteger(tokenId) && tokenId >= 0;
			const isValidBidAmount = parseEther(bidAmount).gte(parseEther(minBid));
			if (isValidToken && isValidBidAmount) setIsValidBid(true);
			else setIsValidBid(false);
		} else setIsValidBid(false);

		return () => setIsValidBid(false);
	}, [tokenId, bidAmount, minBid]);

	const handleSubmit = (event: any) => {
		event.preventDefault();
		write?.();
	};

	return { attributes: { onSubmit: handleSubmit } };
};
