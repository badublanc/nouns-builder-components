import type { DaoConfig, DaoInfo } from '../types';
import { fetchDataWithQuery } from './utils';
import { logWarning } from '../utils';

type FetchDaoOpts = {
	collection: string;
	chain: DaoConfig['chain'];
};

export const fetchDaoData = async ({ collection, chain }: FetchDaoOpts) => {
	const response = await fetchDataWithQuery(query, { collection, chain });
	if (!response) {
		logWarning('no_data_from_api', collection, chain);
		return null;
	}

	const data = formatQueryData(response, chain);
	if (!data) return null;

	return data;
};

const formatQueryData = (data: any, chain: DaoConfig['chain']): Partial<DaoInfo> | null => {
	const { data: result, errors } = data;
	const stats = result?.aggregateStat;
	const info = result?.nouns?.nounsDaos?.nodes[0];
	// const { aggregateStat: stats } = data?.data;

	if (errors) {
		// console.log(errors);
		logWarning('query_error', '', chain);
		return null;
	}

	return {
		name: info?.name,
		symbol: info?.symbol,
		owners: stats?.ownerCount,
		totalSupply: stats?.nftCount,
		contracts: {
			auction: info?.auctionAddress,
			collection: info?.collectionAddress,
			governor: info?.governorAddress,
			metadata: info?.metadataAddress,
			treasury: info?.treasuryAddress,
		},
		chain,
		chainId: chain === 'MAINNET' ? 1 : 5,
	};
};

const query = `query GetDAO($collection: [String!], $chain: Chain!) {
  nouns {
    nounsDaos(
      where: {collectionAddresses: $collection}
      networks: {network: ETHEREUM, chain: $chain}
    ) {
      nodes {
        name
        symbol
        auctionAddress
        collectionAddress
        governorAddress
        metadataAddress
        treasuryAddress
      }
    }
  }
  aggregateStat {
    nftCount(
      networks: {network: ETHEREUM, chain: $chain}
      where: {collectionAddresses: $collection}
    )
    ownerCount(
      networks: {network: ETHEREUM, chain: $chain}
      where: {collectionAddresses: $collection}
    )
  }
}`;
