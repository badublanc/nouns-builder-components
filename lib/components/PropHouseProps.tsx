import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { ComponentConfig, PHProposal, PHRoundData } from '../types';
import { usePropHouseRounds } from '..';
import ComponentWrapper from './ComponentWrapper';
import { PropHouseProp } from './shared/PropHouseProp';

const getListFormatClasses = (format: string) => {
	return format === 'grid' ? 'grid grid-cols-1 md:grid-cols-3' : 'flex flex-col';
};

export const PropHouseProps = ({ dao, opts = {} }: ComponentConfig) => {
	const theme = opts?.theme;
	const roundName = opts?.round;
	const format = (opts?.format as 'grid' | 'list') || 'list';
	const sortDirection = opts?.sortDirection?.toUpperCase() || 'DESC';
	const maxProposals = Number(opts?.max) || 12;
	const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
	const roundData = usePropHouseRounds(dao);
	const [round, setRound] = useState<PHRoundData>();
	const [props, setProps] = useState<PHProposal[]>([]);

	useEffect(() => {
		if (roundData.length) {
			setIsDataLoaded(true);

			let round: PHRoundData = {} as PHRoundData;
			if (roundName) {
				const index = roundData.findIndex((r) => r.title === roundName);
				if (index >= 0) round = roundData[index];
			}

			if (!round.id) round = roundData[0];

			if (sortDirection === 'ASC' && Date.now() < round?.votingEndTime) {
				setProps(round.proposals.sort((a, b) => b.created - a.created));
			} else setProps(round.proposals.sort((a, b) => a.created - b.created));

			setRound(round);
		}
	}, [roundName, roundData, sortDirection]);

	return (
		<ComponentWrapper theme={theme} isDataLoaded={isDataLoaded}>
			{!props && (
				<div id="auction">
					<div className="flex justify-center mx-auto">
						<div className="h-full text-center w-full flex flex-col md:flex-row md:gap-10 items-center">
							<p className="bg-slate-50 p-4 md:p-10 w-full">No auction found</p>
						</div>
					</div>
				</div>
			)}
			<div id="ph-rounds" className={cx(`mx-auto gap-5 `, getListFormatClasses(format))}>
				{round &&
					props.map((prop, i) => {
						if (i >= maxProposals) return null;
						const communitySlug = round.communityName.toLowerCase().replaceAll(' ', '-');
						const roundSlug = round.title.toLowerCase().replaceAll(' ', '-');
						const isWinner = Date.now() > round.votingEndTime && i < round.numWinners;
						return (
							<a
								href={`https://prop.house/${communitySlug}/${roundSlug}/${prop.id}`}
								target="_blank"
								rel="noreferrer"
								key={i}
							>
								<PropHouseProp prop={prop} format={format} isWinner={isWinner} />
							</a>
						);
					})}
			</div>
		</ComponentWrapper>
	);
};
