import { useState } from 'react';
import { useContractRead } from 'wagmi';
import { utils } from 'ethers';
import { AuctionABI } from '../abis';

const useAuction = (address: string) => {
	const [tokenId, setTokenId] = useState<number>(0);
	const [highestBid, setHighestBid] = useState<string>('');
	const [highestBidder, setHighestBidder] = useState<string>('');
	const [startTime, setStartTime] = useState<number>(0);
	const [endTime, setEndTime] = useState<number>(0);
	const [settled, setSettled] = useState<boolean>(false);

	useContractRead({
		address: address as `0x${string}`,
		abi: AuctionABI,
		functionName: 'auction',
		watch: true,
		onSuccess(data) {
			// console.log(data);
			setTokenId(data.tokenId.toNumber());
			setHighestBid(utils.formatEther(data.highestBid));
			setHighestBidder(data.highestBidder);
			setStartTime(data.startTime);
			setEndTime(data.endTime);
			setSettled(data.settled);
		},
		onError(err) {
			console.error(err);
			setTokenId(0);
			setHighestBid('');
			setHighestBidder('');
			setStartTime(0);
			setEndTime(0);
			setSettled(false);
		},
	});

	return { tokenId, highestBid, highestBidder, startTime, endTime, settled };
};

export default useAuction;
