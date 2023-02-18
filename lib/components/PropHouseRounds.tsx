import React, { useEffect, useState } from 'react';
import { useRoundsByHouse, type Round } from 'use-prop-house';
import { ComponentConfig } from '../types';
import ComponentWrapper from './ComponentWrapper';
import { PropHouseRound } from './shared/PropHouseRound';
import { useMediaQuery } from 'react-responsive';

export const PropHouseRounds = ({ opts = {} }: ComponentConfig) => {
	const theme = opts?.theme;
	const houseId = opts?.houseId && Number(opts?.houseId);
	const sortDirection = opts?.sortDirection?.toUpperCase() || 'DESC';
	const rows = Number(opts?.rows) || 3;
	const itemsPerRow = Number(opts?.itemsPerRow) || 2;
	const isMdOrAbove = useMediaQuery({ query: '(min-width: 786px)' });
	const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

	const { data: roundData } = useRoundsByHouse({ houseId });
	const [rounds, setRounds] = useState<Round[]>([]);

	useEffect(() => {
		if (sortDirection === 'ASC') {
			const sorted = [...roundData].sort((a, b) => a.created - b.created);
			setRounds(sorted);
		} else {
			const sorted = [...roundData].sort((a, b) => b.created - a.created);
			setRounds(sorted);
		}
	}, [roundData, sortDirection]);

	return (
		<ComponentWrapper theme={theme} isDataLoaded={roundData.length ? true : false}>
			{!rounds && (
				<div className="flex justify-center mx-auto">
					<div className="h-full text-center w-full flex flex-col md:flex-row md:gap-10 items-center">
						<p className="p-4 md:p-10 w-full">No Prop House rounds found</p>
					</div>
				</div>
			)}
			<div
				id="ph-rounds"
				className={`mx-auto grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-5`}
				style={{
					gridTemplateColumns: isMdOrAbove
						? `repeat(${itemsPerRow},minmax(0,1fr))`
						: 'repeat(1,minmax(0,1fr))',
				}}
			>
				{rounds.map((round, i) => {
					if (rows && i >= rows * itemsPerRow) return null;
					return (
						<a href={round.url} target="_blank" rel="noreferrer" key={round.id}>
							<PropHouseRound round={round} />
						</a>
					);
				})}
			</div>
		</ComponentWrapper>
	);
};
