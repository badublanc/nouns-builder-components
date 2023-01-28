import React, { useEffect, useState } from 'react';
import { DaoInfo } from '../types';
import { useMembers } from '../hooks';

export const MemberList = ({ dao, opts }: { dao: DaoInfo; opts?: DOMStringMap }) => {
	const members = useMembers(dao);

	return (
		<>
			{members.map((m) => {
				return <p>{m.address}</p>;
			})}
		</>
	);
};
