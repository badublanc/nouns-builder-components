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
			className="inline-flex flex-row items-center"
			target="_blank"
			rel="noreferrer"
		>
			{!hideAvatar === true && (
				<span className="mr-2 h-6 w-6 absolute">
					<Avatar address={address} chainId={chainId} />
				</span>
			)}
			<span
				className={cx(
					'w-full overflow-hidden overflow-ellipsis font-bold',
					!hideAvatar === true && 'pl-7'
				)}
			>
				{ensName ? ensName : trunc(address)}
			</span>
		</a>
	);
};
