import type { DaoConfig } from '../types';
import React, { FormEvent, useEffect, useState } from 'react';
import { useDao } from '.';
import { fetchDataWithQueries, logWarning } from '../utils';
import { formatEther, parseEther } from 'ethers/lib/utils.js';

type AuctionData = {
	auction: number;
	isActive: boolean;
	chain: DaoConfig['chain'];
	startTime: number;
	endTime: number;
	highestBid: string;
	highestBidder: string;
	minPctIncrease: string;
};

type TokenData = {
	id: number;
	name: string;
	imageUrl: string;
	attributes: Record<string, any>;
};

export const useAuction = () => {
	const dao = useDao();
	const defaultData = {
		auction: {} as AuctionData,
		token: {} as TokenData,
		minBid: formatEther(parseEther('0.001')),
	};

	const [auctionData, setAuctionData] = useState<AuctionData>(defaultData.auction);
	const [tokenData, setTokenData] = useState<TokenData>(defaultData.token);
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
			const data = await fetchDataWithQueries([auctionQuery, tokenQuery], {
				collection,
				chain: dao.chain,
			});
			const clean = formatData(data, dao.chain);
			if (clean) {
				console.log(clean);
				setAuctionData(clean.auction);
				setTokenData(clean.token);
			} else {
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
		if (!userBid || !Number.isInteger(tokenData.id)) setIsValidUserBid(false);
		else {
			const bid = parseEther(userBid);
			const min = parseEther(minBid);
			const isValid = bid.gte(min);
			setIsValidUserBid(isValid);
		}
		return () => setIsValidUserBid(false);
	}, [minBid, userBid]);

	return {
		auctionData,
		tokenData,
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

const formatData = (data: any[], chain: DaoConfig['chain']) => {
	const { nounsActiveMarket: auctionData } = data[0]?.data?.nouns;
	const tokenData = data[1]?.data?.tokens?.nodes[0]?.token;

	if (!auctionData?.tokenId || !tokenData?.tokenId) return null;

	const auction: AuctionData = {
		auction: Number(auctionData?.tokenId),
		startTime: Number(auctionData?.startTime),
		endTime: Number(auctionData?.endTime),
		isActive: Date.now() < Number(auctionData?.endTime) * 1000,
		highestBid: String(auctionData?.highestBidPrice?.nativePrice?.decimal),
		highestBidder: auctionData?.highestBidder,
		minPctIncrease: String(auctionData?.minBidIncrementPercentage),
		chain,
	};

	const token: TokenData = {
		id: Number(tokenData?.tokenId),
		name: tokenData?.name,
		imageUrl: tokenData?.image?.url,
		attributes: tokenData?.attributes?.map((attribute: Record<string, any>) => {
			return {
				label: attribute?.traitType,
				value: attribute?.value,
			};
		}),
	};

	return { auction, token };
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

const tokenQuery = `query GetTokenOnAuction($collection: [String!], $chain: Chain!) {
  tokens(
    sort: {sortKey: MINTED, sortDirection: DESC}
    pagination: {limit: 1}
    networks: {network: ETHEREUM, chain: $chain}
    where: {collectionAddresses: $collection}
  ) {
    nodes {
      token {
				tokenId
				name
        image {
          url
        }
        attributes {
          traitType
          value
        }
      }
    }
  }
}`;
