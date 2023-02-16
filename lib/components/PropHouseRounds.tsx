import React, { useEffect, useState } from 'react';
import { ComponentConfig, PHRoundData } from '../types';
import { usePropHouseRounds } from '../hooks';
import ComponentWrapper from './ComponentWrapper';
import { PropHouseRound } from './shared/PropHouseRound';

export const PropHouseRounds = ({ dao, opts = {} }: ComponentConfig) => {
	const theme = opts?.theme;
	const sortDirection = opts?.sortDirection?.toUpperCase() || 'DESC';
	const rows = Number(opts?.rows) || 3;
	const itemsPerRow = Number(opts?.itemsPerRow) || 2;
	const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

	const roundData = usePropHouseRounds(dao);
	const [rounds, setRounds] = useState<PHRoundData[]>([]);

	useEffect(() => {
		if (roundData.length) {
			setIsDataLoaded(true);
			if (sortDirection === 'ASC') {
				const sorted = [...roundData].sort((a, b) => a.id - b.id);
				setRounds(sorted);
			} else setRounds(roundData);
		}
	}, [roundData, sortDirection]);

	return (
		<ComponentWrapper theme={theme} isDataLoaded={isDataLoaded}>
			<div id="ph-rounds" className={`mx-auto grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-5`}>
				{rounds.map((round, i) => {
					const communitySlug = round.communityName.toLowerCase().replaceAll(' ', '-');
					const roundSlug = round.title.toLowerCase().replaceAll(' ', '-');
					if (rows && i >= rows * itemsPerRow) return null;
					return (
						<a
							href={`https://prop.house/${communitySlug}/${roundSlug}`}
							target="_blank"
							rel="noreferrer"
							key={i}
						>
							<PropHouseRound round={round} />
						</a>
					);
				})}
			</div>
		</ComponentWrapper>
	);
};
