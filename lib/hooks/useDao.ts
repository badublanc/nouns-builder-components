import type { DaoConfig, DaoInfo } from '../types';
import React, { useContext, useEffect, useState } from 'react';
import { DaoContext } from '../context';
import { fetchDataWithQuery, logWarning } from '../utils';

export const useDao = (config?: Partial<DaoConfig>): DaoInfo | undefined => {
	const ctx = useContext(DaoContext);
	const defaultData = {} as DaoInfo;

	const [collection, setCollection] = useState<string>(config?.collection || ctx.collection || '');
	const [chain, setChain] = useState<DaoConfig['chain']>(config?.chain || ctx.chain || 'MAINNET');
	const [data, setData] = useState<DaoInfo>();

	useEffect(() => {
		const fetchData = async () => {
			const data = await fetchDataWithQuery(query, { collection, chain });
			const clean = formatData(data, chain);
			if (clean) setData(clean);
			else {
				logWarning('no_data', collection, chain);
				setData(defaultData);
			}
		};

		if (collection && chain) fetchData();
	}, [collection, chain]);

	useEffect(() => {
		if (config?.collection) setCollection(config.collection);
		if (config?.chain) setChain(config.chain);
	}, [config]);

	const changeDao = ({ collection, chain }: Partial<DaoConfig>) => {
		if (collection) setCollection(collection);
		if (chain) setChain(chain);
	};

	return data;
};

const formatData = (data: any, chain: DaoConfig['chain']): DaoInfo | null => {
	const { aggregateStat: stats } = data?.data;
	const info = data?.data?.nouns?.nounsDaos?.nodes[0];

	if (!info) return null;

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
