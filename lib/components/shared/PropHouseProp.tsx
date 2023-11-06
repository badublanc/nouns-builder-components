import React from 'react';
import cx from 'classnames';
import type { Round } from 'use-prop-house';
import { pill, statusColors } from '../../styles/shared';
import { relative } from '../../utils';
import { Account } from './Account';

type PropHousePropConfig = {
	prop: Round['proposals'][number];
	format: 'grid' | 'list';
};

export const PropHouseProp = ({ prop, format }: PropHousePropConfig) => {
	const { created, title, summary, proposer, isWinner } = prop;

	return (
		<div
			className={`nbc-h-full nbc-rounded-lg nbc-border nbc-border-theme-border nbc-p-3 nbc-shadow-none nbc-transition-shadow hover:nbc-shadow-md md:nbc-p-5`}
		>
			{format === 'grid' && <span className="opacity-70">{relative(created)}</span>}
			<div className="nbc-mb-2 nbc-flex nbc-flex-row nbc-justify-between">
				<p className="nbc-text-xl nbc-font-bold nbc-leading-snug">{title}</p>
				{isWinner && <p className={cx(pill, statusColors[1])}>Winner</p>}
			</div>
			<p className="nbc-mb-2 nbc-font-normal nbc-opacity-70 nbc-line-clamp-2">{summary}</p>

			<p className="nbc-font-normal">
				<strong>
					<Account address={proposer} chainId={1} />
				</strong>
				{format !== 'grid' && (
					<>
						<span className="nbc-px-2 nbc-opacity-25">•</span>{' '}
						<span className="nbc-opacity-70">{relative(created)}</span>
					</>
				)}
			</p>
		</div>
	);
};
