import React, { useEffect, useState } from 'react';
import type { ComponentConfig, TokenData } from '../types';
import { useCollection } from '..';
import { NFT } from './NFT';
import ComponentWrapper from './ComponentWrapper';
import { useMediaQuery } from 'react-responsive';

export const CollectionList = ({ dao, opts = {} }: ComponentConfig) => {
	const theme = opts?.theme;
	const rows = Number(opts?.rows) || 3;
	const itemsPerRow = Number(opts?.itemsPerRow) || 5;
	const sortDirection = opts?.sortDirection?.toUpperCase() || 'ASC';
	const hideLabels = opts?.hideLabels === true || opts?.hideLabels === 'true';
	const collection = useCollection(dao);
	const isMdOrAbove = useMediaQuery({ query: '(min-width: 786px)' });
	const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
	const [tokens, setTokens] = useState<TokenData[]>([]);

	useEffect(() => {
		if (collection.length) {
			setIsDataLoaded(true);
			if (sortDirection === 'DESC') {
				const sorted = [...collection].sort((a, b) => b.id - a.id);
				setTokens(sorted);
			} else setTokens(collection);
		}
	}, [collection, sortDirection]);

	return (
		<ComponentWrapper theme={theme} isDataLoaded={isDataLoaded}>
			<div
				id="collection"
				className={`mx-auto grid gap-8`}
				style={{
					gridTemplateColumns: isMdOrAbove
						? `repeat(${itemsPerRow},minmax(0,1fr))`
						: 'repeat(3,minmax(0,1fr))',
				}}
			>
				{collection &&
					tokens?.map((token, i) => {
						if (rows && i >= rows * itemsPerRow) return null;
						return (
							<a
								href={`https://nouns.build/dao/${dao.contracts.collection}/${token.id}`}
								key={token.id}
								target="_blank"
								rel="noreferrer"
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
