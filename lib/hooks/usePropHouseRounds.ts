import React, { useEffect, useState } from 'react';
import { DaoInfo, PHRoundData } from '../types';
import { fetchRounds } from '../queries';

export const usePropHouseRounds = (dao: DaoInfo): PHRoundData[] => {
	const [rounds, setRounds] = useState<PHRoundData[]>();

	// fetch data from zora api
	useEffect(() => {
		const fetchData = async () => {
			const { collection } = dao.contracts;
			const data = await fetchRounds({ collection });
			if (data) setRounds(data);
			else setRounds([]);
		};

		if (dao) fetchData();
	}, [dao]);

	return rounds ?? [];
};
