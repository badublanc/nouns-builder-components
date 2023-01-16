import { useState } from 'react';
import { useContractEvent, useContractRead } from 'wagmi';
import { constants, utils } from 'ethers';
import { AuctionABI } from '../abis';

interface UseAuctionConfig {}

export const useAuction = (address: string) => {
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
		// watch: true,
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

	useContractEvent({
		address: address as `0x${string}`,
		abi: AuctionABI,
		eventName: 'AuctionBid',
		listener(args_0, args_1, args_2, args_3, args_4) {
			setTokenId(args_0.toNumber());
			setHighestBidder(args_1);
			setHighestBid(utils.formatEther(args_2));
			if (args_3) setEndTime(args_4.toNumber());
		},
	});

	useContractEvent({
		address: address as `0x${string}`,
		abi: AuctionABI,
		eventName: 'AuctionCreated',
		listener(args_0, args_1, args_2) {
			setTokenId(args_0.toNumber());
			setStartTime(args_1.toNumber());
			setEndTime(args_2.toNumber());
			setSettled(false);
			setHighestBid(utils.formatEther('0'));
			setHighestBidder(constants.AddressZero);
		},
	});

	return { tokenId, highestBid, highestBidder, startTime, endTime, settled };
};
