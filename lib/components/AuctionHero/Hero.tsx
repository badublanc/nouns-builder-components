import type { DaoInfo } from '../../types';
import React, { useEffect, useState } from 'react';
import { useAuction, useToken } from '../..';
import Countdown, { CountdownRenderProps } from 'react-countdown';
import { Account } from './Account';
import { BidForm } from './BidForm';

export const Hero = ({ dao }: { dao: DaoInfo }) => {
	const { auctionData, formData } = useAuction(dao);

	const [latestTokenId, setLatestTokenId] = useState<number>();
	const [tokenId, setTokenId] = useState<number>();
	const [showCountdown, toggleCountdown] = useState<boolean>(true);

	const token = useToken(tokenId, dao);

	useEffect(() => {
		const currentAuctionToken = auctionData?.auctionId;

		if (currentAuctionToken >= 0) {
			if (!Number.isInteger(tokenId)) setTokenId(currentAuctionToken);

			if (!Number.isInteger(latestTokenId) || tokenId === latestTokenId) {
				setTokenId(currentAuctionToken);
				setLatestTokenId(currentAuctionToken);
			} else setLatestTokenId(currentAuctionToken);
		}
	}, [auctionData?.auctionId]);

	const countdownRenderer = (props: CountdownRenderProps) => {
		if (props.completed) {
			// Render a completed state
			return <p>Auction has ended</p>;
		} else {
			// Render a countdown
			return (
				<span>
					{props.hours}h {props.minutes}m {props.seconds}s
				</span>
			);
		}
	};

	return (
		<div id="auction" className="p-10 lg:p-20 col-span-2 w-full">
			<div className="flex justify-center">
				<div className="w-full md:max-w-[75vw] flex flex-col md:flex-row md:gap-10 items-center">
					<div className="md:w-3/5 aspect-square">
						{token?.imageUrl ? (
							<img src={token.imageUrl} className="rounded-lg w-full" alt="" />
						) : (
							<></>
						)}
					</div>
					<div className="my-10 w-full sm:w-3/4 md:w-2/5">
						<div className="flex flex-row items-center w-full gap-2 mb-3 md:mb-6">
							<button
								className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded-full text-sm aspect-square disabled:bg-gray-100 leading-none"
								disabled={!tokenId || tokenId <= 0}
								onClick={() => {
									tokenId !== undefined && tokenId >= 0 && setTokenId(tokenId - 1);
								}}
							>
								←
							</button>
							<button
								className="bg-slate-400 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded-full text-sm aspect-square disabled:bg-gray-100 leading-none"
								disabled={tokenId === auctionData?.auctionId}
								onClick={() => {
									tokenId !== undefined &&
										tokenId < auctionData?.auctionId &&
										setTokenId(tokenId + 1);
								}}
							>
								→
							</button>
						</div>
						<h1 className="text-4xl md:text-5xl bold text-gray-800">
							{token?.name ? token?.name : <></>}
						</h1>
						{auctionData?.auctionId === tokenId ? (
							<>
								<div className="flex gap-5">
									<div className="my-5">
										<p className="text-md text-gray-700 opacity-70">highest bid</p>
										<p className="text-3xl font-bold text-gray-800">Ξ {auctionData?.highestBid}</p>
										{auctionData?.highestBidder && (
											<div className="text-md text-gray-700 truncate w-full mt-2">
												<Account address={auctionData?.highestBidder} chainId={dao.chainId} />
											</div>
										)}
									</div>
									<div className="my-5">
										<p className="text-md text-gray-700 opacity-70">auction ends</p>
										<button
											className="font-bold text-gray-800"
											onClick={() => {
												toggleCountdown(!showCountdown);
											}}
										>
											{showCountdown ? (
												auctionData?.endTime ? (
													<span className="text-3xl">
														<Countdown
															renderer={countdownRenderer}
															daysInHours={true}
															date={auctionData.endTime}
														/>
													</span>
												) : (
													<></>
												)
											) : (
												<>
													<span className="text-left text-lg block">
														{new Date(auctionData?.endTime).toLocaleDateString('en-US')}
													</span>
													<span className="text-left text-lg">
														{new Date(auctionData?.endTime).toLocaleTimeString('en-US')}
													</span>
												</>
											)}
										</button>
									</div>
								</div>
							</>
						) : (
							<>
								{auctionData?.highestBidder && (
									<div className="my-5">
										<p className="text-md text-gray-700 opacity-70">owned by</p>
										<p className="text-3xl font-bold text-gray-800 truncate w-full max-w-[300px]">
											<Account address={token.owner} chainId={dao.chainId} />
										</p>
									</div>
								)}
							</>
						)}
						{tokenId === auctionData?.auctionId && auctionData?.highestBid && (
							<BidForm tokenId={auctionData?.auctionId} formData={formData} dao={dao} />
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
