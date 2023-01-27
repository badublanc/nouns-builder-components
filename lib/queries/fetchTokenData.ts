import type { DaoConfig, TokenData } from '../types';
import { fetchDataWithQuery } from './utils';
import { logWarning } from '../utils';

type FetchTokenOpts = {
	tokenId: number;
	collection: string;
	chain: DaoConfig['chain'];
};

export const fetchTokenData = async ({
	tokenId,
	collection,
	chain,
}: FetchTokenOpts): Promise<TokenData | null> => {
	const response = await fetchDataWithQuery(query, {
		tokenId: String(tokenId),
		collection,
		chain,
	});
	if (!response) {
		logWarning('no_data_from_api', collection, chain);
		return null;
	}

	const data = formatQueryData(response, chain);
	if (!data?.name) {
		logWarning('incomplete_data_from_api', collection, chain);
		return null;
	}

	return data;
};

const formatQueryData = (data: any, chain: DaoConfig['chain']): TokenData | null => {
	const { data: result, errors } = data;
	const tokenData = result?.token?.token;
	const mintData = result?.token?.events[0]?.transactionInfo;
	const marketData = result?.nouns?.nounsMarkets?.nodes[0];

	if (errors) {
		// console.log(errors);
		logWarning('query_error', '', chain);
		return null;
	}

	return {
		id: Number(tokenData?.tokenId),
		owner: tokenData?.owner,
		name: tokenData?.name,
		description: tokenData?.description,
		imageUrl: tokenData?.image?.url,
		chain,
		attributes: tokenData?.attributes?.map((attribute: Record<string, any>) => {
			return {
				label: attribute?.traitType,
				value: attribute?.value,
			};
		}),
		auctionInfo: {
			tokenId: Number(marketData?.tokenId),
			winner: marketData?.winner,
			amount: String(marketData?.highestBidPrice?.nativePrice?.decimal),
			startTime: Number(marketData?.startTime) * 1000,
			endTime: Number(marketData?.endTime) * 1000,
		},
		mintInfo: {
			blockNumber: Number(mintData?.blockNumber),
			blockTimestamp: Date.parse(mintData?.blockTimestamp),
			transactionHash: mintData?.transactionHash,
		},
	};
};

const query = `query GetToken($tokenId: String!, $collection: String!, $chain: Chain!) {
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
		events(filter: {eventTypes: MINT_EVENT}) {
			transactionInfo {
				blockNumber
				blockTimestamp
				transactionHash
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
