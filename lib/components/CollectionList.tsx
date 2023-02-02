import React, { useEffect, useState } from 'react';
import { DaoInfo, Theme, TokenData } from '../types';
import { useCollection } from '..';
import { NFT } from './NFT';
import ComponentWrapper from './ComponentWrapper';

export const CollectionList = ({ dao, opts }: { dao: DaoInfo; opts: DOMStringMap }) => {
	const theme = opts?.theme as Theme;
	const rows = Number(opts.rows) || 3;
	const itemsPerRow = Number(opts.itemsPerRow) || 5;
	const sortDirection = opts.sortDirection?.toLocaleUpperCase() || 'ASC';
	const hideLabels = opts?.hideLabels === 'true';
	// const showDetails = opts?.showDetails === 'true';
	const collection = useCollection(dao);

	const [tokens, setTokens] = useState<TokenData[]>([]);

	useEffect(() => {
		if (collection.length) {
			if (sortDirection === 'DESC') {
				const sorted = [...collection].sort((a, b) => b.id - a.id);
				setTokens(sorted);
			} else setTokens(collection);
		}
	}, [collection, sortDirection]);

	return (
		<ComponentWrapper theme={theme}>
			<div id="collection" className={`mx-auto grid gap-8 grid-cols-2 md:grid-cols-${itemsPerRow}`}>
				{tokens?.map((token, i) => {
					if (rows && i >= rows * itemsPerRow) return null;
					return (
						<a
							href={`https://nouns.build/dao/${dao.contracts.collection}/${token.id}`}
							key={token.id}
						>
							<NFT
								token={token}
								dao={dao}
								showDetails={false}
								inCollectionList={true}
								hideLabels={hideLabels}
							/>
						</a>
					);
				})}
			</div>
		</ComponentWrapper>
	);
};
