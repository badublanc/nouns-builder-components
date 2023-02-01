import React, { useEffect, useRef, useState } from 'react';
import { useBalance } from 'wagmi';
import type { DaoInfo, Theme } from '../types';
import { applyTheme } from '../themes/utils';
import { formatEther, parseEther } from 'ethers/lib/utils.js';

export const Treasury = ({ dao, opts }: { dao: DaoInfo; opts?: DOMStringMap }) => {
	const ref = useRef(null);
	const theme = opts?.theme as Theme;
	const address = dao.contracts.treasury;

	const [balance, setBalance] = useState<string>('0');

	useBalance({
		address: address as `0x${string}`,
		chainId: dao.chainId,
		onSettled(data, error) {
			if (error) {
				console.error(error);
				setBalance('0');
			} else {
				const balance = formatEther(data?.value || '0');
				const pIndex = data?.formatted?.indexOf('.');
				if (pIndex && pIndex > 0) setBalance(balance.slice(0, pIndex + 3));
				else setBalance(balance);
			}
		},
	});

	useEffect(() => {
		if (ref.current != null) {
			const target = ref.current as HTMLElement;
			applyTheme(target, theme);
		}
	}, [theme, ref]);

	return (
		<a
			href={'https://etherscan.io/address/' + address}
			className={
				'w-fit block text-text-base bg-background border border-theme-border p-3 md:p-5 rounded-lg hover:shadow-md shadow-none transition-shadow'
			}
			rel="noreferrer"
			target="_blank"
			ref={ref}
		>
			<p className="font-bold">
				<span className="opacity-60 inline-block mr-3">Treasury</span>Ξ {balance}
			</p>
		</a>
	);
};
