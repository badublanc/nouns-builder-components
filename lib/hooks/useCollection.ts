import React, { useEffect, useState } from 'react';
import type { DaoInfo, CollectionData, TokenData } from '../types';
import { fetchCollectionTokens } from '../queries';

export const useCollection = (dao: DaoInfo): CollectionData => {
	const [tokens, setTokens] = useState<TokenData[]>();

	// fetch data from zora api
	useEffect(() => {
		const fetchData = async () => {
			const { chain } = dao;
			const { collection } = dao.contracts;
			const data = await fetchCollectionTokens({ collection, chain });
			if (data) setTokens(data);
			else setTokens([]);
		};

		if (dao) fetchData();
	}, [dao]);

	return tokens
		? {
				name: '',
				website: '',
				image: '',
				tokens,
		  }
		: ({} as CollectionData);
};
