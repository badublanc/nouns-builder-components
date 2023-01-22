import type { DaoConfig, DaoInfo } from '../types';
import React, { useEffect, useState } from 'react';
import { fetchDataWithQuery, logWarning } from '../utils';

type TokenData = {
	id: number;
	owner: string;
	name: string;
	description: string;
	imageUrl: string;
	attributes: Record<string, any>;
	auctionData: {
		winner?: string;
		amount: string;
		startTime: number;
		endTime: number;
	};
	chain: DaoConfig['chain'];
};

const defaultData = {} as TokenData;

export const useToken = (id: number, dao: DaoInfo) => {
	const [tokenData, setTokenData] = useState<TokenData>(defaultData);

	// fetch data from zora api
	useEffect(() => {
		const fetchData = async () => {
			const { collection } = dao.contracts;
			const data = await fetchDataWithQuery(tokenQuery, {
				tokenId: String(id),
				collection,
				chain: dao.chain,
			});
			const clean = formatData(data, dao.chain);
			if (clean) setTokenData(clean);
			else {
				logWarning('no_data', collection, dao.chain);
			}
		};

		if (Number.isInteger(id) && dao.contracts?.collection && dao.chain) fetchData();
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
