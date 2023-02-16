import React, { useEffect, useState } from 'react';
import { useContract, useProvider } from 'wagmi';
import { BigNumber } from '@ethersproject/bignumber';
import type { DaoInfo, TokenData } from '../types';
import { logWarning } from '../utils';
import { TokenABI } from '../abis';
import { fetchTokenData } from '../queries';

export const useToken = (id: number | undefined, dao: DaoInfo): TokenData => {
	const provider = useProvider();
	const [tokenData, setTokenData] = useState<TokenData>();

	const tokenContract = useContract({
		address: dao.contracts.collection as `0x${string}`,
		abi: TokenABI,
		signerOrProvider: provider,
	});

	const getDataFromContract = async (id: number): Promise<TokenData | null> => {
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
			attributes: properties,
			chain: dao.chain,
		};
	};

	// fetch data from zora api
	useEffect(() => {
		if (!id) return;
		const fetchData = async (id: number) => {
			const { chain } = dao;
			const { collection } = dao.contracts;
			const data = await fetchTokenData({ tokenId: id, collection, chain });
			if (data) setTokenData(data);
			else {
				const data = await getDataFromContract(id);
				if (data) setTokenData(data);
				else {
					logWarning('no_data', collection, chain);
				}
			}
		};

		if (id !== undefined && dao.contracts?.collection && dao.chain) fetchData(id);
	}, [id, dao]);

	return tokenData ?? ({} as TokenData);
};
