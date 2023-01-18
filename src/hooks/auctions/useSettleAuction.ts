import type { Network } from '../../types';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { AuctionABI } from '../../abis';
import { getChainIdFromNetwork } from '../../utils';

interface UseSettleAuctionConfig {
	auctionAddress: string;
	network?: Network;
}

export const useSettleAuction = ({
	auctionAddress,
	network = 'mainnet',
}: UseSettleAuctionConfig) => {
	const { config } = usePrepareContractWrite({
		address: auctionAddress as `0x${string}`,
		chainId: getChainIdFromNetwork(network),
		abi: AuctionABI,
		functionName: 'settleCurrentAndCreateNewAuction',
		enabled: Boolean(auctionAddress),
	});

	const { write } = useContractWrite(config);
	const settleAuction = () => write?.();

	return { settleAuction };
};
