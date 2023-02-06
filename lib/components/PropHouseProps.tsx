import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { DaoInfo, PHProposal, PHRoundData, Theme } from '../types';
import { usePropHouseRounds } from '..';
import ComponentWrapper from './ComponentWrapper';
import { PropHouseProp } from './shared/PropHouseProp';

const getListFormatClasses = (format: string) => {
	return format === 'grid' ? 'grid grid-cols-1 md:grid-cols-3' : 'flex flex-col';
};

export const PropHouseProps = ({ dao, opts }: { dao: DaoInfo; opts?: DOMStringMap }) => {
	const theme = opts?.theme as Theme;
	const roundName = opts?.round;
	const format = (opts?.format as 'grid' | 'list') || 'list';
	const sortDirection = opts?.sortDirection?.toUpperCase() || 'DESC';
	const maxProposals = Number(opts?.max) || 12;

	const roundData = usePropHouseRounds(dao);
	const [round, setRound] = useState<PHRoundData>();
	const [props, setProps] = useState<PHProposal[]>([]);

	useEffect(() => {
		if (roundData.length) {
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
		<ComponentWrapper theme={theme}>
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
