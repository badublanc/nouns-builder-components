import React, { FormEvent, useEffect, useState } from 'react';
import { useContractEvent } from 'wagmi';
import { AddressZero } from '../constants';
import { formatEther, parseEther } from 'viem';
import type { DaoConfig, DaoInfo, AuctionData } from '../types';
import { AuctionABI } from '../abis';
import { fetchAuctionData } from '../queries';

const defaultData = {
	auction: {} as AuctionData,
	minBid: formatEther(parseEther('0.001')),
	minPctIncrease: 10n,
};

export const useAuction = (dao: DaoInfo) => {
	const [auctionData, setAuctionData] = useState<AuctionData>(defaultData.auction);
	const [minBid, setMinBid] = useState<string>(defaultData.minBid);
	const [userBid, setUserBid] = useState<string>('');
	const [isValidUserBid, setIsValidUserBid] = useState<boolean>(false);
	const [minPctIncrease, setMinPctIncrease] = useState<bigint>(defaultData.minPctIncrease);

	const handleUserBidChange = (event: FormEvent<HTMLInputElement>) => {
		setUserBid(event.currentTarget.value);
	};

	// fetch data from zora api
	useEffect(() => {
		const fetchData = async () => {
			const { chain } = dao;
			const { collection } = dao.contracts;
			const data = await fetchAuctionData({ collection, chain });
			if (data) {
				setAuctionData(data);
				setMinPctIncrease(
					data.minPctIncrease ? BigInt(data.minPctIncrease) : defaultData.minPctIncrease
				);
			} else {
				setAuctionData(defaultData.auction);
				setMinPctIncrease(defaultData.minPctIncrease);
			}
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
				if (bid > 0n) {
					const min = bid + bid / minPctIncrease;
					setMinBid(formatEther(min));
				} else setMinBid(defaultData.minBid);
			}
			return () => setMinBid(defaultData.minBid);
		}
	}, [auctionData.highestBid, minPctIncrease]);

	// confirm if user bid is valid
	useEffect(() => {
		if (Date.now() >= auctionData.endTime) setIsValidUserBid(false);
		else if (!userBid || Number(userBid) < 0 || !Number.isInteger(auctionData.auctionId))
			setIsValidUserBid(false);
		else {
			const bid = parseEther(userBid);
			const min = parseEther(minBid);
			const isValid = bid >= min;
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
		listener(logs) {
			const { args } = logs[0];
			const { tokenId, bidder, amount, extended, endTime } = args;
			const data = { ...auctionData };
			data.auctionId = Number(tokenId);
			data.highestBidder = bidder!;
			data.highestBid = formatEther(amount!);
			if (extended) data.endTime = Number(endTime) * 1000;
			setAuctionData(data);
		},
	});

	// listen for new auction
	useContractEvent({
		address: dao.contracts.auction as `0x${string}`,
		chainId: dao.chainId,
		abi: AuctionABI,
		eventName: 'AuctionCreated',
		listener(logs) {
			const { args } = logs[0];
			const { tokenId, startTime, endTime } = args;
			const data: AuctionData = {
				auctionId: Number(tokenId),
				startTime: Number(startTime) * 1000,
				endTime: Number(endTime) * 1000,
				highestBid: formatEther(0n),
				highestBidder: AddressZero,
				chain: dao.chain,
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
