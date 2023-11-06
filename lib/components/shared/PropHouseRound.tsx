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
			return 'nbc-bg-blue-200 nbc-text-blue-500';
		case 'voting':
			return 'nbc-bg-green-200 nbc-text-green-500';
		default:
			return 'nbc-bg-gray-200 nbc-text-gray-500';
	}
};

export const PropHouseRound = ({ round }: PropHouseRoundConfig) => {
	const { name, description, status, proposals, funding, proposalDeadline } = round;
	const statusColor = getStatusColorClasses(status);

	return (
		<div className="nbc-h-full nbc-rounded-lg nbc-border nbc-border-theme-border nbc-p-3 nbc-shadow-none nbc-transition-shadow hover:nbc-shadow-md md:nbc-p-5">
			<div>
				<div className="nbc-mb-3 nbc-flex nbc-flex-row nbc-justify-between">
					<p className="nbc-text-xl nbc-font-bold nbc-leading-snug">{name}</p>
					<p className={cx(pill, statusColor)}>{status}</p>
				</div>
				<p className="nbc-text-xs nbc-font-normal nbc-line-clamp-3 md:nbc-text-base">
					{description}
				</p>
			</div>
			<div className="nbc-flex nbc-flex-row nbc-justify-between nbc-gap-3 nbc-pt-3 md:nbc-pt-5">
				<div>
					<p className={label}>Funding</p>
					<p className="nbc-font-bold">{`${funding.amount} ${
						funding.currency
					} ${String.fromCharCode(215)} ${funding.winners}`}</p>
				</div>
				<div>
					<p className={label}>Prop deadline</p>
					<p className="nbc-font-bold">{relative(proposalDeadline)}</p>
				</div>
				<div>
					<p className={label}>Proposals</p>
					<p className="nbc-font-bold">{proposals.length}</p>
				</div>
			</div>
		</div>
	);
};
