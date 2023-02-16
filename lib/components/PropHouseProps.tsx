import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { useRoundsByHouse, type Round } from 'use-prop-house';
import { ComponentConfig } from '../types';
import ComponentWrapper from './ComponentWrapper';
import { PropHouseProp } from './shared/PropHouseProp';

const getListFormatClasses = (format: string) => {
	return format === 'grid' ? 'grid grid-cols-1 md:grid-cols-3' : 'flex flex-col';
};

export const PropHouseProps = ({ opts = {} }: ComponentConfig) => {
	const theme = opts?.theme;
	const houseId = opts?.houseId ? Number(opts?.houseId) : 21;
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
