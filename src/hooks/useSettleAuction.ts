import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { AuctionABI } from '../abis';

interface UseSettleAuctionConfig {
	address: string;
}

export const useSettleAuction = ({ address }: UseSettleAuctionConfig) => {
	const { config } = usePrepareContractWrite({
		address: address as `0x${string}`,
		abi: AuctionABI,
		functionName: 'settleCurrentAndCreateNewAuction',
		enabled: Boolean(address),
	});

	const { write } = useContractWrite(config);
	const settleAuction = () => write?.();

	return { settleAuction };
};
