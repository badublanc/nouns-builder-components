import React, { useEffect, useState } from 'react';
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
	const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

	useEffect(() => {
		if (members.length) {
			setIsDataLoaded(true);
		}
	}, [members]);

	return (
		<ComponentWrapper theme={theme} isDataLoaded={isDataLoaded}>
			<div
				className={`nbc-mx-auto nbc-grid nbc-gap-3 md:nbc-gap-10`}
				style={{
					gridTemplateColumns: isMdOrAbove
						? `repeat(${itemsPerRow},minmax(0,1fr))`
						: 'repeat(3,minmax(0,1fr))',
				}}
			>
				{members?.map((member, i) => {
					if (rows && i >= rows * itemsPerRow) return null;
					return (
						<div className="nbc-w-full" key={i}>
							<a
								href={`https://etherscan.io/address/${member.address}`}
								className="nbc-inline-flex nbc-flex-row nbc-items-center"
								target="_blank"
								rel="noreferrer"
							>
								<Avatar address={member.address} chainId={dao.chainId} />
							</a>
							<Account address={member.address} chainId={dao.chainId} hideAvatar={true} />
						</div>
					);
				})}
			</div>
		</ComponentWrapper>
	);
};
