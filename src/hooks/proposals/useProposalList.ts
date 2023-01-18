import type { Network, SortDirection } from '../../types';
import { useEffect, useState } from 'react';
import { getProposalList, type QueriedProposal } from './utils';

interface UseProposalListConfig {
	governorAddress: string;
	network?: Network;
	sortDirection?: SortDirection;
}

export const useProposalList = ({
	governorAddress,
	network = 'mainnet',
	sortDirection = 'desc',
}: UseProposalListConfig) => {
	const [proposals, setProposals] = useState<QueriedProposal[]>([]);

	useEffect(() => {
		const fetchProposals = async () => {
			const props = await getProposalList({
				governorAddress,
				network,
				sortDirection,
			});
			if (props && props.length) setProposals(props);
			else setProposals([]);
		};

		if (governorAddress) fetchProposals();
		else setProposals([]);

		return () => setProposals([]);
	}, [governorAddress, network, sortDirection]);

	return proposals;
};
