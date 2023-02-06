import React, { useEffect, useState } from 'react';
import { constants } from 'ethers';
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
			if (data.length) {
				// filter burned tokens
				const filteredMembers = data.filter((m) => m.address !== constants.AddressZero);
				setMembers(filteredMembers);
			} else setMembers([]);
		};

		if (dao) fetchData();
	}, [dao]);

	return members;
};
