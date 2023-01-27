import type { DaoConfig, TokenData } from '../types';
import { fetchDataWithQuery } from './utils';
import { logWarning } from '../utils';

type FetchCollectionOpts = {
	collection: string;
	chain: DaoConfig['chain'];
};

export const fetchCollectionTokens = async ({
	collection,
	chain,
}: FetchCollectionOpts): Promise<TokenData[] | null> => {
	const response = await fetchDataWithQuery(query, { collection, chain });
	if (!response) {
		logWarning('no_data_from_api', collection, chain);
		return null;
	}

	const data = formatQueryData(response, chain);
	if (!data) return null;

	return data;
};

const formatQueryData = (data: any, chain: DaoConfig['chain']): TokenData[] | null => {
	const { data: result, errors } = data;
	const tokenData = result?.tokens?.nodes;
	const marketData = result?.nouns?.nounsMarkets?.nodes;

	if (errors) {
		// console.log(errors);
		logWarning('query_error', '', chain);
		return null;
	}

	const auctionData: TokenData['auctionInfo'][] = marketData.map((rawData: any) => {
		const amount = rawData?.highestBidPrice?.nativePrice?.decimal;
		return {
			tokenId: Number(rawData?.tokenId),
			winner: rawData?.winner ?? '',
			amount: amount ? String(amount) : '0.00',
			startTime: Number(rawData?.startTime) * 1000,
			endTime: Number(rawData?.endTime) * 1000,
		};
	});

	const tokens: TokenData[] = tokenData.map((rawData: any): TokenData => {
		const { token, events } = rawData;
		const mintData = events[0]?.transactionInfo;
		return {
			id: Number(token?.tokenId),
			owner: token?.owner,
			name: token?.name,
			description: token?.description,
			imageUrl: token?.image?.url,
			chain,
			attributes: token?.attributes?.map((attribute: Record<string, any>) => {
				return {
					label: attribute?.traitType,
					value: attribute?.value,
				};
			}),
			mintInfo: {
				blockNumber: Number(mintData?.blockNumber),
				blockTimestamp: Date.parse(mintData?.blockTimestamp),
				transactionHash: mintData?.transactionHash,
			},
			auctionInfo:
				auctionData.find((d) => {
					return d?.tokenId === Number(token?.tokenId);
				}) ?? ({} as TokenData['auctionInfo']),
		};
	});

	return tokens;
};

const query = `query GetCollection($collection: [String!], $chain: Chain!) {
  tokens(
    networks: {network: ETHEREUM, chain: $chain}
    where: {collectionAddresses: $collection}
    pagination: {limit: 250}
    sort: {sortKey: MINTED, sortDirection: ASC}
  ) {
    nodes {
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
  }
  nouns {
    nounsMarkets(
      filter: {nounsMarketType: NOUNS_BUILDER_AUCTION}
      networks: {network: ETHEREUM, chain: $chain}
      where: {collectionAddresses: $collection}
      pagination: {limit: 250}
      sort: {sortKey: CREATED, sortDirection: ASC}
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
