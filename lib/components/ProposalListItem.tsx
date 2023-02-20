import React from 'react';
import cx from 'classnames';
import type { DaoInfo, ProposalData } from '../types';
import { relative } from '../utils';

type ProposalListItemConfig = {
	dao: DaoInfo;
	proposal: ProposalData;
};

const statusColors: Record<string, string> = {
	pending: 'bg-yellow-200 text-yellow-800',
	active: 'bg-green-200 text-green-800',
	executed: 'bg-green-200 text-green-800',
	defeated: 'bg-red-200 text-red-800',
	canceled: 'bg-red-200 text-red-800',
	queued: 'bg-yellow-200 text-yellow-800',
	unknown: 'bg-gray-200 text-gray-500',
};

export const ProposalListItem = ({ dao, proposal }: ProposalListItemConfig) => {
	const { id, status, title, voteStart, voteEnd } = proposal;
	const { collection } = dao.contracts;

	return (
		<a href={`https://nouns.build/dao/${collection}/vote/${id}`} target="_blank" rel="noreferrer">
			<div
				className={`flex flex-col-reverse md:flex-row justify-between gap-3 border border-theme-border p-3 md:p-5 rounded-lg hover:shadow-md shadow-none transition-shadow`}
			>
				<div className="flex flex-col">
					<p className="text-xl font-bold leading-snug">{title}</p>
					<p className="text-sm opacity-40">{relative(voteStart)}</p>
				</div>
				<div className="flex flex-row md:flex-row-reverse items-center gap-3">
					{status && (
						<>
							<p
								className={cx(
									statusColors[status.toLowerCase() || 'unknown'],
									'rounded-lg px-3 py-2 text-center font-bold text-xs md:text-base'
								)}
							>
								{status}
							</p>
							{status === 'Active' && (
								<p className="text-sm opacity-40">ends {relative(voteEnd)}</p>
							)}
						</>
					)}
				</div>
			</div>
		</a>
	);
};
