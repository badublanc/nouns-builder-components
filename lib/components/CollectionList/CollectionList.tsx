import React, { useEffect, useState } from 'react';
import { DaoInfo, TokenData } from '../../types';
import { useCollection } from '../..';
import { NFT } from './NFT';

export const CollectionList = ({ dao, opts }: { dao: DaoInfo; opts: DOMStringMap }) => {
	const collection = useCollection(dao);
	const itemsPerRow = opts.itemsPerRow || 6;
	const sortDirection = opts.sortDirection?.toLocaleUpperCase() || 'ASC';

	const [tokens, setTokens] = useState<TokenData[]>([]);

	useEffect(() => {
		const tokens = collection.tokens;
		if (tokens && tokens.length) {
			if (sortDirection === 'DESC') {
				const sorted = tokens.sort((a, b) => b.id - a.id);
				setTokens(sorted);
			} else setTokens(tokens);
		}
	}, [collection]);

	return (
		<div id="collection" className={`mx-auto grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-2`}>
			{tokens?.length ? (
				tokens.map((token) => {
					return (
						<NFT
							key={token.id}
							token={token}
							showDetails={false}
							dao={dao}
							darkMode={false}
							inCollectionList={true}
						/>
					);
				})
			) : (
				<></>
			)}
		</div>
	);
};
