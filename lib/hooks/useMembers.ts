import React, { useEffect, useState } from 'react';
import type { DaoInfo, DaoMember } from '../types';
import { fetchMembers } from '../queries';

export const useMembers = (dao: DaoInfo) => {
	const [members, setMembers] = useState<DaoMember[]>([]);

	// fetch data from zora api
	useEffect(() => {
		const fetchData = async () => {
			const { chain } = dao;
			const { collection } = dao.contracts;
			const data = await fetchMembers({ collection, chain });
			if (data) setMembers(data);
			else setMembers([]);
		};

		if (dao) fetchData();
	}, [dao]);

	return members;
};
