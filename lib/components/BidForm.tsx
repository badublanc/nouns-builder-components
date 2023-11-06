import React, { useRef, useEffect, useState } from 'react';
import { parseEther } from 'viem';
import { usePrepareContractWrite, useContractWrite } from 'wagmi';
import { writeContract } from '@wagmi/core';
import { applyTheme } from '../themes/utils';
import { AuctionABI } from '../abis';

export const BidForm = ({ auctionData, formData, dao, theme }: any) => {
	const ref = useRef(null);

	const [isComplete, setIsComplete] = useState<boolean>(false);

	const settleAuction = async () => {
		await writeContract({
			address: dao.contracts.auction as `0x${string}`,
			chainId: dao.chainId,
			abi: AuctionABI,
			functionName: 'settleCurrentAndCreateNewAuction',
		});
	};

	// place bid contract logic
	const bidLogic = usePrepareContractWrite({
		address: dao.contracts.auction as `0x${string}`,
		chainId: dao.chainId,
		abi: AuctionABI,
		functionName: 'createBid',
		args: [BigInt(String(auctionData.auctionId))],
		enabled: !formData.btn.disabled && formData.input.value,
		value: parseEther(formData.input.value || '0'),
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
		let timer: ReturnType<typeof setTimeout>;

		if (Date.now() >= auctionData.endTime) {
			setIsComplete(true);
			return;
		}

		setIsComplete(false);

		// update once time expires
		timer = setTimeout(() => {
			setIsComplete(true);
		}, auctionData.endTime - Date.now());

		return () => clearTimeout(timer);
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
			className={
				'nbc-mt-4 nbc-flex nbc-w-full nbc-flex-col nbc-gap-5 nbc-font-bold sm:nbc-flex-row md:nbc-mt-8'
			}
			ref={ref}
		>
			{isComplete ? (
				<button
					type="submit"
					className="nbc-mr-2 nbc-mb-2 nbc-w-full nbc-flex-shrink-0 nbc-rounded-lg nbc-border-2 nbc-border-text-base nbc-px-5 nbc-py-2.5 nbc-text-xl disabled:nbc-pointer-events-none disabled:nbc-cursor-not-allowed disabled:nbc-opacity-40"
				>
					Settle auction
				</button>
			) : (
				<>
					<div className="nbc-relative nbc-mb-2 nbc-w-full nbc-flex-grow">
						<span className="nbc-pointer-events-none nbc-absolute nbc-inset-y-0 nbc-left-0 nbc-flex nbc-items-center nbc-pl-3 nbc-text-lg nbc-text-gray-400">
							Ξ
						</span>
						<input
							{...formData.input}
							className="focus:nbc-shadow-outline nbc-w-full nbc-appearance-none nbc-rounded-lg nbc-border nbc-py-4 nbc-px-4 nbc-pl-7 nbc-text-xl nbc-leading-tight nbc-text-gray-700 nbc-shadow"
						/>
					</div>

					<button
						type="submit"
						{...formData.btn}
						className="nbc-mr-2 nbc-mb-2 nbc-flex-shrink-0 nbc-rounded-lg nbc-border-2 nbc-border-text-base nbc-px-5 nbc-py-2.5 nbc-text-xl disabled:nbc-pointer-events-none disabled:nbc-cursor-not-allowed disabled:nbc-opacity-40"
					>
						Place bid
					</button>
				</>
			)}
		</form>
	);
};
