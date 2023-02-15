import React from 'react';
import cx from 'classnames';
import type { Round } from 'use-prop-house';
import { label, pill } from '../../styles/shared';
import { relative } from '../../utils';

type PropHouseRoundConfig = {
	round: Round;
};

const getStatusColorClasses = (status: string) => {
	switch (status.toLowerCase()) {
		case 'proposing':
			return 'bg-blue-200 text-blue-500';
		case 'voting':
			return 'bg-green-200 text-green-500';
		default:
			return 'bg-gray-200 text-gray-500';
	}
};

export const PropHouseRound = ({ round }: PropHouseRoundConfig) => {
	const { name, description, status, proposals, funding, proposalDeadline } = round;
	const statusColor = getStatusColorClasses(status);

	return (
		<div className="h-full border border-theme-border p-3 md:p-5 rounded-lg hover:shadow-md shadow-none transition-shadow">
			<div>
				<div className="flex flex-row justify-between mb-3">
					<p className="font-bold text-xl leading-snug">{name}</p>
					<p className={cx(pill, statusColor)}>{status}</p>
				</div>
				<p className="line-clamp-3 font-normal text-xs md:text-base">{description}</p>
			</div>
			<div className="flex flex-row gap-3 justify-between pt-3 md:pt-5">
				<div>
					<p className={label}>Funding</p>
					<p className="font-bold">{`${funding.amount} ${funding.currency} ${String.fromCharCode(
						215
					)} ${funding.winners}`}</p>
				</div>
				<div>
					<p className={label}>Prop deadline</p>
					<p className="font-bold">{relative(proposalDeadline)}</p>
				</div>
				<div>
					<p className={label}>Proposals</p>
					<p className="font-bold">{proposals.length}</p>
				</div>
			</div>
		</div>
	);
};
