import type { DaoConfig, AuctionData } from '../types';
import { fetchDataWithQuery } from './utils';
import { logWarning } from '../utils';

type FetchAuctionOpts = {
	collection: string;
	chain: DaoConfig['chain'];
};

export const fetchAuctionData = async ({
	collection,
	chain,
}: FetchAuctionOpts): Promise<AuctionData | null> => {
	const response = await fetchDataWithQuery(query, { collection, chain });
	if (!response) {
		logWarning('no_data_from_api', collection, chain);
		return null;
	}

	const data = formatQueryData(response, chain);
	if (!data) return null;

	return data;
};

const formatQueryData = (data: any, chain: DaoConfig['chain']): AuctionData | null => {
	const { data: result, errors } = data;
	const auctionData = result?.nouns?.nounsActiveMarket;

	if (errors) {
		// console.log(errors);
		logWarning('query_error', '', chain);
		return null;
	}

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

const query = `query GetCurrentAuction($collection: String!, $chain: Chain!) {
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
