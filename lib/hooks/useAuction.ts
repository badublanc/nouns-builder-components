import type { DaoConfig, DaoInfo } from '../types';
import React, { FormEvent, useEffect, useState } from 'react';
import { fetchDataWithQuery, logWarning } from '../utils';
import { formatEther, parseEther } from 'ethers/lib/utils.js';
import { constants } from 'ethers';
import { useContractEvent } from 'wagmi';
import { AuctionABI } from '../abis';
import { emit } from '../utils/events';

type AuctionData = {
	auctionId: number;
	chain: DaoConfig['chain'];
	startTime: number;
	endTime: number;
	highestBid: string;
	highestBidder: string;
	minPctIncrease: string;
};

const defaultData = {
	auction: {} as AuctionData,
	minBid: formatEther(parseEther('0.001')),
};

export const useAuction = (dao: DaoInfo) => {
	const [auctionData, setAuctionData] = useState<AuctionData>(defaultData.auction);
	const [minBid, setMinBid] = useState<string>(defaultData.minBid);
	const [userBid, setUserBid] = useState<string>('');
	const [isValidUserBid, setIsValidUserBid] = useState<boolean>(false);

	const handleUserBidChange = (event: FormEvent<HTMLInputElement>) => {
		setUserBid(event.currentTarget.value);
	};

	// fetch data from zora api
	useEffect(() => {
		const fetchData = async () => {
			const { collection } = dao.contracts;
			const data = await fetchDataWithQuery(auctionQuery, {
				collection,
				chain: dao.chain,
			});
			const clean = formatData(data, dao.chain);
			if (clean) setAuctionData(clean);
			else {
				logWarning('no_data', collection, dao.chain);
			}
		};

		if (dao.contracts?.collection && dao.chain) fetchData();
	}, [dao]);

	// calculate minimum bid
	useEffect(() => {
		const { highestBid } = auctionData;
		if (!highestBid) setMinBid(defaultData.minBid);
		else {
			const bid = parseEther(highestBid);
			if (bid.gt(parseEther('0'))) {
				const min = bid.add(bid.div(auctionData.minPctIncrease));
				setMinBid(formatEther(min));
			} else setMinBid(defaultData.minBid);
		}
		return () => setMinBid(defaultData.minBid);
	}, [auctionData.highestBid, auctionData.minPctIncrease]);

	// confirm if user bid is valid
	useEffect(() => {
		if (Date.now() >= auctionData.endTime) setIsValidUserBid(false);
		else if (!userBid || !Number.isInteger(auctionData.auctionId)) setIsValidUserBid(false);
		else {
			const bid = parseEther(userBid);
			const min = parseEther(minBid);
			const isValid = bid.gte(min);
			setIsValidUserBid(isValid);
		}
		return () => setIsValidUserBid(false);
	}, [auctionData.endTime, minBid, userBid]);

	// listen for new bids
	useContractEvent({
		address: dao.contracts.auction as `0x${string}`,
		chainId: dao.chainId,
		abi: AuctionABI,
		eventName: 'AuctionBid',
		listener(tokenId, bidder, bid, extended, endTime) {
			const data = { ...auctionData };
			data.auctionId = tokenId.toNumber();
			data.highestBidder = bidder;
			data.highestBid = formatEther(bid);
			if (extended) data.endTime = endTime.toNumber() * 1000;
			setAuctionData(data);
		},
	});

	// listen for new auction
	useContractEvent({
		address: dao.contracts.auction as `0x${string}`,
		chainId: dao.chainId,
		abi: AuctionABI,
		eventName: 'AuctionCreated',
		listener(tokenId, startTime, endTime) {
			const data: AuctionData = {
				auctionId: tokenId.toNumber(),
				startTime: startTime.toNumber() * 1000,
				endTime: endTime.toNumber() * 1000,
				highestBid: formatEther('0'),
				highestBidder: constants.AddressZero,
				chain: dao.chain,
				minPctIncrease: auctionData.minPctIncrease,
			};
			setAuctionData(data);
			// emit('auctionCreated', data);
		},
	});

	return {
		auctionData,
		formData: {
			attributes: {},
			input: {
				value: userBid,
				min: minBid,
				step: 'any',
				type: 'number',
				placeholder: `${minBid} or more`,
				onChange: handleUserBidChange,
			},
			btn: {
				disabled: !isValidUserBid,
			},
		},
	};
};

const formatData = (data: any, chain: DaoConfig['chain']) => {
	const { nounsActiveMarket: auctionData } = data?.data?.nouns;

	if (!auctionData?.tokenId) return null;

	const auction: AuctionData = {
		auctionId: Number(auctionData?.tokenId),
		startTime: Number(auctionData?.startTime) * 1000,
		endTime: Number(auctionData?.endTime) * 1000,
		highestBid: String(auctionData?.highestBidPrice?.nativePrice?.decimal),
		highestBidder: auctionData?.highestBidder,
		minPctIncrease: String(auctionData?.minBidIncrementPercentage),
		chain,
	};

	return auction;
};

const auctionQuery = `query GetCurrentAuction($collection: String!, $chain: Chain!) {
  nouns {
    nounsActiveMarket(
      where: {collectionAddress: $collection}
      network: {network: ETHEREUM, chain: $chain}
    ) {
      tokenId
      startTime
      endTime
      highestBidder
      highestBidPrice {
        nativePrice {
          decimal
        }
      }
      minBidIncrementPercentage
    }
  }
}`;
