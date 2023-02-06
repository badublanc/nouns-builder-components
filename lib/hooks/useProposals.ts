import React, { useEffect, useState } from 'react';
import { DaoInfo, ProposalData } from '../types';
import { fetchProposals } from '../queries';

export const useProposals = (dao: DaoInfo): ProposalData[] => {
	const [proposals, setProposals] = useState<ProposalData[]>();

	// fetch data from zora api
	useEffect(() => {
		const fetchData = async () => {
			const { chain } = dao;
			const { collection } = dao.contracts;
			const data = await fetchProposals({ collection, chain });
			if (data) setProposals(data);
			else setProposals([]);
		};

		if (dao) fetchData();
	}, [dao]);

	return proposals ?? [];
};
