import { usePrepareContractWrite, useContractWrite, useSigner } from 'wagmi';
import { parseEther } from 'ethers/lib/utils.js';
import { BigNumber } from 'ethers';
import { AuctionABI } from '../abis';
import { useEffect, useState } from 'react';

interface UseBidFormConfig {
	tokenId: number;
	amount: string;
	address: string;
	min: string;
}

export const useBidForm = ({
	tokenId,
	amount,
	address,
	min,
}: UseBidFormConfig) => {
	const [isValidBid, setIsValidBid] = useState<boolean>(false);
	const parseTokenId = (id: number) => {
		if (!id) return BigNumber.from(0);
		return BigNumber.from(id);
	};

	const { config, error } = usePrepareContractWrite({
		address: address as `0x${string}`,
		abi: AuctionABI,
		functionName: 'createBid',
		args: [parseTokenId(tokenId)],
		enabled: isValidBid,
		overrides: {
			value: parseEther(amount || '0'),
		},
		onError(err) {
			console.error(err);
		},
	});

	const { data, isLoading, isSuccess, write } = useContractWrite(config);

	useEffect(() => {
		if (tokenId && amount && min) {
			const isValidToken = Number.isInteger(tokenId) && tokenId >= 0;
			const isValidBidAmount = parseEther(amount).gte(parseEther(min));
			if (isValidToken && isValidBidAmount) setIsValidBid(true);
			else setIsValidBid(false);
		} else setIsValidBid(false);

		return () => setIsValidBid(false);
	}, [tokenId, amount, min]);

	const handleSubmit = (event: any) => {
		event.preventDefault();
		write?.();
	};

	return { attributes: { onSubmit: handleSubmit } };
};
