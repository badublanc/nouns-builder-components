import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { AuctionABI } from '../abis';

const useSettleAuction = ({ address }: { address: string }) => {
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

export default useSettleAuction;
