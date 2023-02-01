import React, { useEffect, useState } from 'react';
import { constants } from 'ethers';
import Countdown, { CountdownRenderProps } from 'react-countdown';
import type { DaoInfo, Theme } from '../types';
import { useAuction, useToken } from '..';
import ComponentWrapper from './ComponentWrapper';
import { Account } from './shared/Account';
import { BidForm } from './BidForm';

export const AuctionHero = ({ dao, opts }: { dao: DaoInfo; opts?: DOMStringMap }) => {
	const theme = opts?.theme as Theme;
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

	const date = auctionData && new Date(auctionData.endTime).toLocaleDateString('en-US');
	const time = auctionData && new Date(auctionData.endTime).toLocaleTimeString('en-US');

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
		<ComponentWrapper theme={theme}>
			<div id="auction">
				<div className="flex justify-center mx-auto">
					<div className="w-full flex flex-col md:flex-row md:gap-10 items-center">
						<div className="md:w-3/5 aspect-square">
							{token?.imageUrl && <img src={token.imageUrl} className="rounded-lg w-full" alt="" />}
						</div>
						<div className="mt-10 mb-5 w-full sm:w-3/4 md:w-2/5">
							<div className="flex flex-row items-center w-full gap-2 mb-3 md:mb-6">
								<button
									className="bg-gray-400 opacity-70 hover:opacity-100 text-base font-bold py-1 px-2 rounded-full text-md aspect-square disabled:opacity-25 leading-none"
									disabled={!tokenId || tokenId <= 0}
									onClick={() => {
										tokenId !== undefined && tokenId >= 0 && setTokenId(tokenId - 1);
									}}
								>
									←
								</button>
								<button
									className="bg-slate-400 opacity-70 hover:opacity-100 text-base font-bold py-1 px-2 rounded-full text-md aspect-square disabled:opacity-25 leading-none"
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
							<h1 className="text-4xl md:text-5xl font-bold">
								{token?.name ? token?.name : <></>}
							</h1>
							{auctionData?.auctionId === tokenId ? (
								<>
									<div className="flex gap-5">
										<div className="my-5">
											<p className="text-md text-text-base opacity-40">highest bid</p>
											<p className="text-3xl font-bold text-text-base">
												Ξ {auctionData?.highestBid}
											</p>
										</div>
										<div className="my-5">
											<p className="text-md text-text-base opacity-40">auction ends</p>
											<button
												className="font-bold text-text-base text-left"
												onClick={() => {
													toggleCountdown(!showCountdown);
												}}
											>
												{showCountdown ? (
													auctionData?.endTime && (
														<span className="text-3xl">
															<Countdown
																renderer={countdownRenderer}
																daysInHours={true}
																date={auctionData.endTime}
															/>
														</span>
													)
												) : (
													<>
														<span className="text-left text-lg">
															{date} {time}
														</span>
														<span className="text-left text-lg"></span>
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
											<p className="text-md text-text-base opacity-40">owned by</p>
											<p className="text-3xl font-bold text-text-base truncate w-full max-w-[300px]">
												<Account address={token.owner} chainId={dao.chainId} />
											</p>
										</div>
									)}
								</>
							)}
							{tokenId && tokenId === auctionData?.auctionId && (
								<>
									<BidForm
										tokenId={auctionData?.auctionId}
										formData={formData}
										dao={dao}
										theme={theme}
									/>
									{auctionData?.highestBidder !== constants.AddressZero && (
										<div className="my-5">
											<p className="text-1xl font-bold text-text-base truncate w-full max-w-[300px] flex flex-row gap-3 justify-between">
												<Account address={auctionData?.highestBidder} chainId={dao.chainId} />
												<span className="text-md text-text-base opacity-40">
													Ξ {auctionData.highestBid}
												</span>
											</p>
										</div>
									)}
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</ComponentWrapper>
	);
};
