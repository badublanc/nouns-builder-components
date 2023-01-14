import { usePrepareContractWrite, useContractWrite, useSigner } from 'wagmi';
import { parseEther } from 'ethers/lib/utils.js';
import { BigNumber } from 'ethers';
import { AuctionABI } from '../abis';

type Props = {
	tokenId: number;
	amount: string;
	address: string;
};

const useBidForm = ({ tokenId, amount, address }: Props) => {
	const parseTokenId = (id: number) => {
		if (!id) return BigNumber.from(0);
		return BigNumber.from(id);
	};

	const { config, error } = usePrepareContractWrite({
		address: address as `0x${string}`,
		abi: AuctionABI,
		functionName: 'createBid',
		args: [parseTokenId(tokenId)],
		enabled: Boolean(Number.isInteger(tokenId) && amount),
		overrides: {
			value: parseEther(amount || '0'),
		},
		onError(err) {
			console.error(err);
		},
	});

	const { data, isLoading, isSuccess, write } = useContractWrite(config);

	const handleSubmit = (event: any) => {
		event.preventDefault();
		write?.();
	};

	return { attributes: { onSubmit: handleSubmit } };
};

export default useBidForm;
