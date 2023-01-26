import React, { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils.js';
import { usePrepareContractWrite, useContractWrite, useNetwork, useSwitchNetwork } from 'wagmi';
import { AuctionABI } from '../../abis';

export const BidForm = ({ tokenId, formData, dao }: any) => {
	const { chain } = useNetwork();

	const [isWrongNetwork, setIsWrongNetwork] = useState<boolean>(false);

	const { switchNetwork } = useSwitchNetwork();

	const { config } = usePrepareContractWrite({
		address: dao.contracts.auction as `0x${string}`,
		chainId: dao.chainId,
		abi: AuctionABI,
		functionName: 'createBid',
		args: [BigNumber.from(String(tokenId))],
		enabled: !formData.btn.disabled && !isWrongNetwork,
		overrides: {
			value: parseEther(formData.input.value || '0'),
		},
		onError(err) {
			console.error(err);
		},
	});

	const { write } = useContractWrite(config);

	const handleSubmit = (event: any) => {
		event.preventDefault();
		console.log('placing bid...');
		write?.();
	};

	useEffect(() => {
		if (dao?.chainId === chain?.id) setIsWrongNetwork(false);
		else setIsWrongNetwork(true);
	}, [dao, chain]);

	return (
		<>
			{isWrongNetwork ? (
				<div className="mt-12 sm:mt-6 flex flex-col sm:flex-row gap-5 w-full">
					<button
						onClick={() => switchNetwork?.(dao.chainId)}
						className={`text-white bg-purple-700 hover:bg-red-800 rounded-lg text-xl px-5 py-4 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800 disabled:bg-gray-500 disabled:dark:bg-grey-500 disabled:cursor-not-allowed disabled:pointer-events-none flex-shrink-0 w-full`}
					>
						Switch to {dao.chainId === 1 ? 'Mainnet' : 'Goerli'}
					</button>
				</div>
			) : (
				<form
					onSubmit={handleSubmit}
					className="mt-12 sm:mt-6 flex flex-col sm:flex-row gap-5 w-full"
				>
					<div className="relative mb-2 w-full flex-grow">
						<span className="text-lg absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
							Ξ
						</span>
						<input
							className="text-2xl shadow appearance-none border rounded-lg w-full py-4 pl-7 px-4 text-gray-700 leading-tight focus:shadow-outline"
							{...formData.input}
						/>
					</div>

					<button
						type="submit"
						className={`text-white bg-purple-700 hover:bg-blue-800 rounded-lg text-xl px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 disabled:bg-gray-500 disabled:dark:bg-grey-500 disabled:cursor-not-allowed disabled:pointer-events-none flex-shrink-0`}
						{...formData.btn}
					>
						Place bid
					</button>
				</form>
			)}
		</>
	);
};
