import React from 'react';
import cx from 'classnames';
import { PHProposal } from '../../types';
import { pill, statusColors } from '../../styles/shared';
import { relative } from '../../utils';
import { Account } from './Account';

type PropHousePropConfig = {
	prop: PHProposal;
	format: 'grid' | 'list';
	isWinner: boolean;
};

export const PropHouseProp = ({ prop, format, isWinner }: PropHousePropConfig) => {
	const { created, title, tldr, proposer } = prop;

	return (
		<div
			className={`h-full border border-theme-border p-3 md:p-5 rounded-lg hover:shadow-md shadow-none transition-shadow`}
		>
			{format === 'grid' && <span className="opacity-70">{relative(created)}</span>}
			<div className="flex flex-row justify-between mb-2">
				<p className="font-bold text-xl leading-snug">{title}</p>
				{isWinner && <p className={cx(pill, statusColors[1])}>Winner</p>}
			</div>
			<p className="font-normal line-clamp-2 mb-2 opacity-70">{tldr}</p>

			<p className="font-normal">
				<strong>
					<Account address={proposer} chainId={1} />
				</strong>
				{format !== 'grid' && (
					<>
						<span className="px-2 opacity-25">•</span>{' '}
						<span className="opacity-70">{relative(created)}</span>
					</>
				)}
			</p>
		</div>
	);
};
