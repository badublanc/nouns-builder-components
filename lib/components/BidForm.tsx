import React, { useRef, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils.js';
import { usePrepareContractWrite, useContractWrite } from 'wagmi';
import { applyTheme } from '../themes/utils';
import { AuctionABI } from '../abis';

export const BidForm = ({ auctionData, formData, dao, theme }: any) => {
	const ref = useRef(null);

	const [isComplete, setIsComplete] = useState<boolean>(false);

	// settle auction contract logic
	const settleLogic = usePrepareContractWrite({
		address: dao.contracts.auction as `0x${string}`,
		chainId: dao.chainId,
		abi: AuctionABI,
		functionName: 'settleCurrentAndCreateNewAuction',
		enabled: isComplete,
		onError(err) {
			console.error(err);
		},
	});

	const settle = useContractWrite(settleLogic.config);
	const settleAuction = () => settle.write?.();

	// place bid contract logic
	const bidLogic = usePrepareContractWrite({
		address: dao.contracts.auction as `0x${string}`,
		chainId: dao.chainId,
		abi: AuctionABI,
		functionName: 'createBid',
		args: [BigNumber.from(String(auctionData.auctionId))],
		enabled: !formData.btn.disabled,
		overrides: {
			value: parseEther(formData.input.value || '0'),
		},
		onError(err) {
			console.error(err);
		},
	});

	const bid = useContractWrite(bidLogic.config);
	const placeBid = () => bid.write?.();

	const handleSubmit = (event: any) => {
		event.preventDefault();
		if (isComplete) settleAuction();
		else placeBid();
	};

	useEffect(() => {
		if (Date.now() >= auctionData.endTime) setIsComplete(true);
		else setIsComplete(false);
	}, [auctionData]);

	useEffect(() => {
		if (ref.current != null) {
			const target = ref.current as HTMLElement;
			applyTheme(target, theme);
		}
	}, [theme, ref]);

	return (
		<form
			onSubmit={handleSubmit}
			className={'mt-4 md:mt-8 flex flex-col font-bold sm:flex-row gap-5 w-full'}
			ref={ref}
		>
			{isComplete ? (
				<button
					type="submit"
					className="rounded-lg text-xl w-full px-5 py-2.5 mr-2 mb-2 disabled:cursor-not-allowed disabled:pointer-events-none flex-shrink-0 border-2 border-text-base disabled:opacity-40"
				>
					Settle auction
				</button>
			) : (
				<>
					<div className="relative mb-2 w-full flex-grow">
						<span className="text-lg absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
							Ξ
						</span>
						<input
							{...formData.input}
							className="text-xl shadow appearance-none border rounded-lg w-full py-4 pl-7 px-4 text-gray-700 leading-tight focus:shadow-outline"
						/>
					</div>

					<button
						type="submit"
						{...formData.btn}
						className="rounded-lg text-xl px-5 py-2.5 mr-2 mb-2 disabled:cursor-not-allowed disabled:pointer-events-none flex-shrink-0 border-2 border-text-base disabled:opacity-40"
					>
						Place bid
					</button>
				</>
			)}
		</form>
	);
};
