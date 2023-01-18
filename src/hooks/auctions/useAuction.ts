import type { Network } from '../../types';
import { useState } from 'react';
import { useContractEvent, useContractRead } from 'wagmi';
import { constants, utils } from 'ethers';
import { AuctionABI } from '../../abis';
import { getChainIdFromNetwork } from '../../utils';

interface UseAuctionConfig {
	auctionAddress: string;
	network?: Network;
}

export const useAuction = ({
	auctionAddress,
	network = 'mainnet',
}: UseAuctionConfig) => {
	const [tokenId, setTokenId] = useState<number>(0);
	const [highestBid, setHighestBid] = useState<string>('');
	const [highestBidder, setHighestBidder] = useState<string>('');
	const [startTime, setStartTime] = useState<number>(0);
	const [endTime, setEndTime] = useState<number>(0);
	const [settled, setSettled] = useState<boolean>(false);

	useContractRead({
		address: auctionAddress as `0x${string}`,
		chainId: getChainIdFromNetwork(network),
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
		address: auctionAddress as `0x${string}`,
		chainId: getChainIdFromNetwork(network),
		abi: AuctionABI,
		eventName: 'AuctionBid',
		listener(tokenId, bidder, bid, extended, endTime) {
			setTokenId(tokenId.toNumber());
			setHighestBidder(bidder);
			setHighestBid(utils.formatEther(bid));
			if (extended) setEndTime(endTime.toNumber());
		},
	});

	useContractEvent({
		address: auctionAddress as `0x${string}`,
		chainId: getChainIdFromNetwork(network),
		abi: AuctionABI,
		eventName: 'AuctionCreated',
		listener(tokenId, startTime, endTime) {
			setTokenId(tokenId.toNumber());
			setStartTime(startTime.toNumber());
			setEndTime(endTime.toNumber());
			setSettled(false);
			setHighestBid(utils.formatEther('0'));
			setHighestBidder(constants.AddressZero);
		},
	});

	return { tokenId, highestBid, highestBidder, startTime, endTime, settled };
};
