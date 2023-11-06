import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import type { DaoInfo } from '../../types';
import { fetchEnsData, trunc } from '../../utils';
import { Avatar } from './Avatar';

type AccountConfig = {
	address: string;
	chainId: DaoInfo['chainId'];
	hideAvatar?: boolean;
};

export const Account = ({ address, chainId, hideAvatar = false }: AccountConfig) => {
	const [ensName, setEnsName] = useState<string>('');

	useEffect(() => {
		const getEnsData = async (address: string) => {
			const { name } = await fetchEnsData(address);
			if (name) setEnsName(name);
			else setEnsName('');
		};
		if (address) getEnsData(address);
		else setEnsName('');
	}, [address]);

	return (
		<a
			href={`https://etherscan.io/address/${address}`}
			className="nbc-inline-flex nbc-flex-row nbc-items-center"
			target="_blank"
			rel="noreferrer"
		>
			{!hideAvatar === true && (
				<span className="nbc-absolute nbc-mr-2 nbc-h-6 nbc-w-6">
					<Avatar address={address} chainId={chainId} />
				</span>
			)}
			<span
				className={cx(
					'nbc-w-full nbc-overflow-hidden nbc-overflow-ellipsis nbc-font-bold',
					!hideAvatar === true && 'nbc-pl-7'
				)}
			>
				{ensName || trunc(address)}
			</span>
		</a>
	);
};
