import React from 'react';
import type { ComponentConfig } from '../types';
import { useMembers } from '../hooks';
import { Avatar } from './shared/Avatar';
import { Account } from './shared/Account';
import ComponentWrapper from './ComponentWrapper';

export const MemberList = ({ dao, opts = {} }: ComponentConfig) => {
	const theme = opts?.theme;
	const rows = Number(opts?.rows) || 3;
	const perRow = 6;

	const members = useMembers(dao);

	return (
		<ComponentWrapper theme={theme}>
			<div className={`mx-auto grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-10`}>
				{members?.map((member, i) => {
					if (rows && i >= rows * perRow) return null;
					return (
						<div className="flex flex-col" key={i}>
							<Avatar address={member.address} chainId={dao.chainId} />
							<Account address={member.address} chainId={dao.chainId} hideAvatar={true} />
						</div>
					);
				})}
			</div>
		</ComponentWrapper>
	);
};
