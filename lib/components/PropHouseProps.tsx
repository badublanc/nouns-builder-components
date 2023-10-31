import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { useRoundsByHouse, type Round } from 'use-prop-house';
import { ComponentConfig } from '../types';
import ComponentWrapper from './ComponentWrapper';
import { PropHouseProp } from './shared/PropHouseProp';

const getListFormatClasses = (format: string) => {
	return format === 'grid'
		? 'nbc-grid nbc-grid-cols-1 md:nbc-grid-cols-3'
		: 'nbc-flex nbc-flex-col';
};

export const PropHouseProps = ({ opts = {} }: ComponentConfig) => {
	const theme = opts?.theme;
	const houseId = opts?.houseId && Number(opts?.houseId);
	const roundName = opts?.round ?? '';
	const format = (opts?.format as 'grid' | 'list') || 'list';
	const maxProposals = Number(opts?.max) || 12;

	const { data: roundData } = useRoundsByHouse({ houseId });
	const [round, setRound] = useState<Round>();

	useEffect(() => {
		const parseRounds = () => {
			const index = roundData.findIndex((r) => r.name === roundName);
			if (index >= 0) setRound(roundData[index]);
			else setRound(undefined);
		};

		if (roundName && roundData.length) parseRounds();
		else setRound(undefined);
	}, [roundName, roundData]);

	return (
		<ComponentWrapper theme={theme} isDataLoaded={roundData.length ? true : false}>
			{!round && (
				<div className="nbc-mx-auto nbc-flex nbc-justify-center">
					<div className="nbc-flex nbc-h-full nbc-w-full nbc-flex-col nbc-items-center nbc-text-center md:nbc-flex-row md:nbc-gap-10">
						<p className="nbc-w-full nbc-p-4 md:nbc-p-10">No Prop House props found</p>
					</div>
				</div>
			)}
			<div id="ph-rounds" className={cx(`nbc-mx-auto nbc-gap-5 `, getListFormatClasses(format))}>
				{round &&
					round.proposals.map((prop, i) => {
						if (i >= maxProposals) return null;
						return (
							<a href={prop.url} target="_blank" rel="noreferrer" key={prop.id}>
								<PropHouseProp prop={prop} format={format} />
							</a>
						);
					})}
			</div>
		</ComponentWrapper>
	);
};
