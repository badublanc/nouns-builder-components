import React, { FormEvent, useEffect, useState } from 'react';
import { useContractEvent } from 'wagmi';
import { constants } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils.js';
import type { DaoConfig, DaoInfo, AuctionData } from '../types';
import { AuctionABI } from '../abis';
import { fetchAuctionData } from '../queries';

const defaultData = {
	auction: {} as AuctionData,
	minBid: formatEther(parseEther('0.001')),
};

export const useAuction = (dao: DaoInfo) => {
	const [auctionData, setAuctionData] = useState<AuctionData>(defaultData.auction);
	const [minBid, setMinBid] = useState<string>(defaultData.minBid);
	const [userBid, setUserBid] = useState<string>('0');
	const [isValidUserBid, setIsValidUserBid] = useState<boolean>(false);

	const handleUserBidChange = (event: FormEvent<HTMLInputElement>) => {
		setUserBid(event.currentTarget.value);
	};

	// fetch data from zora api
	useEffect(() => {
		const fetchData = async () => {
			const { chain } = dao;
			const { collection } = dao.contracts;
			const data = await fetchAuctionData({ collection, chain });
			if (data) setAuctionData(data);
			else setAuctionData(defaultData.auction);
		};

		if (dao.contracts?.collection && dao.chain) fetchData();
	}, [dao]);

	// calculate minimum bid
	useEffect(() => {
		if (auctionData?.auctionId) {
			const { highestBid } = auctionData;
			if (!highestBid || Number(highestBid) < 0) setMinBid(defaultData.minBid);
			else {
				const bid = parseEther(highestBid);
				if (bid.gt(parseEther('0'))) {
					const min = bid.add(bid.div(auctionData.minPctIncrease));
					setMinBid(formatEther(min));
				} else setMinBid(defaultData.minBid);
			}
			return () => setMinBid(defaultData.minBid);
		}
	}, [auctionData.highestBid, auctionData.minPctIncrease]);

	// confirm if user bid is valid
	useEffect(() => {
		if (Date.now() >= auctionData.endTime) setIsValidUserBid(false);
		else if (!userBid || Number(userBid) < 0 || !Number.isInteger(auctionData.auctionId))
			setIsValidUserBid(false);
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
			addMinBid: () => setUserBid(minBid),
		},
	};
};
