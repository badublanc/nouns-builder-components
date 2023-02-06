import React, { useEffect, useState } from 'react';
import { DaoInfo, PHRoundData, Theme } from '../types';
import { usePropHouseRounds } from '../hooks';
import ComponentWrapper from './ComponentWrapper';
import { PropHouseRound } from './shared/PropHouseRound';

export const PropHouseRounds = ({ dao, opts }: { dao: DaoInfo; opts?: DOMStringMap }) => {
	const theme = opts?.theme as Theme;
	const sortDirection = opts?.sortDirection?.toUpperCase() || 'DESC';
	const rows = Number(opts?.rows) || 3;
	const itemsPerRow = 2;

	const roundData = usePropHouseRounds(dao);
	const [rounds, setRounds] = useState<PHRoundData[]>([]);

	useEffect(() => {
		if (roundData.length) {
			if (sortDirection === 'ASC') {
				const sorted = [...roundData].sort((a, b) => b.id - a.id);
				setRounds(sorted);
			} else setRounds(roundData);
		}
	}, [roundData, sortDirection]);

	return (
		<ComponentWrapper theme={theme}>
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
