import React from 'react';
import cx from 'classnames';
import type { DaoInfo, ProposalData } from '../types';
import { relative } from '../utils';

type ProposalListItemConfig = {
	dao: DaoInfo;
	proposal: ProposalData;
};

const statusColors: Record<string, string> = {
	pending: 'nbc-bg-yellow-200 nbc-text-yellow-800',
	active: 'nbc-bg-green-200 nbc-text-green-800',
	executed: 'nbc-bg-green-200 nbc-text-green-800',
	defeated: 'nbc-bg-red-200 nbc-text-red-800',
	canceled: 'nbc-bg-red-200 nbc-text-red-800',
	queued: 'nbc-bg-yellow-200 nbc-text-yellow-800',
	unknown: 'nbc-bg-gray-200 nbc-text-gray-500',
};

export const ProposalListItem = ({ dao, proposal }: ProposalListItemConfig) => {
	const { id, status, title, voteStart, voteEnd } = proposal;
	const { collection } = dao.contracts;

	return (
		<a href={`https://nouns.build/dao/${collection}/vote/${id}`} target="_blank" rel="noreferrer">
			<div
				className={`nbc-flex nbc-flex-col-reverse nbc-justify-between nbc-gap-3 nbc-rounded-lg nbc-border nbc-border-theme-border nbc-p-3 nbc-shadow-none nbc-transition-shadow hover:nbc-shadow-md md:nbc-flex-row md:nbc-p-5`}
			>
				<div className="nbc-flex nbc-flex-col">
					<p className="nbc-text-xl nbc-font-bold nbc-leading-snug">{title}</p>
					<p className="nbc-text-sm nbc-opacity-40">{relative(voteStart)}</p>
				</div>
				<div className="nbc-flex nbc-flex-row nbc-items-center nbc-gap-3 md:nbc-flex-row-reverse">
					{status && (
						<>
							<p
								className={cx(
									statusColors[status.toLowerCase() || 'unknown'],
									'nbc-rounded-lg nbc-px-3 nbc-py-2 nbc-text-center nbc-text-xs nbc-font-bold md:nbc-text-base'
								)}
							>
								{status}
							</p>
							{status === 'Active' && (
								<p className="nbc-text-sm nbc-opacity-40">ends {relative(voteEnd)}</p>
							)}
						</>
					)}
				</div>
			</div>
		</a>
	);
};
