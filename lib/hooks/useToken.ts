import type { DaoConfig, DaoInfo } from '../types';
import React, { useEffect, useState } from 'react';
import { fetchDataWithQuery, logWarning } from '../utils';
import { BigNumber } from '@ethersproject/bignumber';
import { useContract, useProvider } from 'wagmi';
import { TokenABI } from '../abis';

type TokenData = {
	id: number;
	owner: string;
	name: string;
	description: string;
	imageUrl: string;
	attributes: Record<string, any>;
	auctionData?: {
		winner: string;
		amount: string;
		startTime: number;
		endTime: number;
	};
	chain: DaoConfig['chain'];
};

const defaultData = {} as TokenData;

export const useToken = (id: number | undefined, dao: DaoInfo) => {
	const provider = useProvider();
	const [tokenData, setTokenData] = useState<TokenData>(defaultData);

	const tokenContract = useContract({
		address: dao.contracts.collection as `0x${string}`,
		abi: TokenABI,
		signerOrProvider: provider,
	});

	const fetchDataFromContract = async (id: number): Promise<TokenData | null> => {
		const tokenId = BigNumber.from(String(id));
		const response = await tokenContract?.tokenURI(tokenId);

		if (!response) return null;

		const data = JSON.parse(window.atob(response.split(',')[1]));
		const { name, description, image, properties } = data;

		return {
			id,
			owner: '',
			name,
			description,
			imageUrl: image,
			attributes: {},
			chain: dao.chain,
		};
	};

	// fetch data from zora api
	useEffect(() => {
		const fetchData = async (id: number) => {
			const { collection } = dao.contracts;
			const data = await fetchDataWithQuery(tokenQuery, {
				tokenId: String(id),
				collection,
				chain: dao.chain,
			});
			const clean = formatData(data, dao.chain);
			if (clean?.name) setTokenData(clean);
			else {
				logWarning('no_data_from_api', collection, dao.chain);
				const data = await fetchDataFromContract(id);
				if (data) setTokenData(data);
				else {
					logWarning('no_data', collection, dao.chain);
				}
			}
		};

		if (id !== undefined && dao.contracts?.collection && dao.chain) fetchData(id);
	}, [id, dao]);

	return tokenData;
};

const formatData = (data: any, chain: DaoConfig['chain']) => {
	const tokenData = data?.data?.token?.token;
	const marketData = data?.data?.nouns?.nounsMarkets?.nodes[0];

	if (!tokenData?.tokenId) return null;

	const token: TokenData = {
		id: Number(tokenData?.tokenId),
		owner: tokenData?.owner,
		name: tokenData?.name,
		description: tokenData?.description,
		imageUrl: tokenData?.image?.url,
		attributes: tokenData?.attributes?.map((attribute: Record<string, any>) => {
			return {
				label: attribute?.traitType,
				value: attribute?.value,
			};
		}),
		auctionData: {
			winner: marketData?.winner,
			amount: String(marketData?.highestBidPrice?.nativePrice?.decimal),
			startTime: Number(marketData?.startTime) * 1000,
			endTime: Number(marketData?.endTime) * 1000,
		},
		chain,
	};

	return token;
};

const tokenQuery = `query GetToken($tokenId: String!, $collection: String!, $chain: Chain!) {
  token(
    token: {address: $collection, tokenId: $tokenId}
    network: {network: ETHEREUM, chain: $chain}
  ) {
    token {
      tokenId
      owner
      name
      description
      image {
        url
      }
      attributes {
        traitType
        value
      }
    }
  }
  nouns {
    nounsMarkets(
      filter: {nounsMarketType: NOUNS_BUILDER_AUCTION}
      networks: {network: ETHEREUM, chain: $chain}
      where: {tokens: {tokenId: $tokenId, address: $collection}}
    ) {
      nodes {
        status
        tokenId
        startTime
        endTime
        winner
        highestBidPrice {
          nativePrice {
            decimal
          }
        }
      }
    }
  }
}`;
