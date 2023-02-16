import React from 'react';
import type { ComponentConfig } from '../types';
import { useMembers } from '../hooks';
import { Avatar } from './shared/Avatar';
import { Account } from './shared/Account';
import ComponentWrapper from './ComponentWrapper';
import { useMediaQuery } from 'react-responsive';

export const MemberList = ({ dao, opts = {} }: ComponentConfig) => {
	const theme = opts?.theme;
	const rows = Number(opts?.rows) || 3;
	const itemsPerRow = Number(opts?.itemsPerRow) || 6;
	const isMdOrAbove = useMediaQuery({ query: '(min-width: 786px)' });
	const members = useMembers(dao);

	return (
		<ComponentWrapper theme={theme}>
			<div
				className={`mx-auto grid gap-3 md:gap-10`}
				style={{
					gridTemplateColumns: isMdOrAbove
						? `repeat(${itemsPerRow},minmax(0,1fr))`
						: 'repeat(3,minmax(0,1fr))',
				}}
			>
				{members?.map((member, i) => {
					if (rows && i >= rows * itemsPerRow) return null;
					return (
						<div className="w-full" key={i}>
							<Avatar address={member.address} chainId={dao.chainId} />
							<Account address={member.address} chainId={dao.chainId} hideAvatar={true} />
						</div>
					);
				})}
			</div>
		</ComponentWrapper>
	);
};
