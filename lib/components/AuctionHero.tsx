import React, { useEffect, useState } from 'react';
import Countdown, { CountdownRenderProps } from 'react-countdown';
import type { ComponentConfig } from '../types';
import { useAuction, useToken } from '..';
import { AddressZero } from '../constants';
import ComponentWrapper from './ComponentWrapper';
import { Account } from './shared/Account';
import { BidForm } from './BidForm';
import TokenImage from './shared/TokenImage';

export const AuctionHero = ({ dao, opts = {} }: ComponentConfig) => {
	const theme = opts?.theme;
	const { auctionData, formData } = useAuction(dao);
	const [latestTokenId, setLatestTokenId] = useState<number>();
	const [tokenId, setTokenId] = useState<number>();
	const [showCountdown, toggleCountdown] = useState<boolean>(true);
	const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
	const token = useToken(tokenId, dao);

	useEffect(() => {
		Object.keys(auctionData).length && setIsDataLoaded(true);

		const currentAuctionToken = auctionData?.auctionId;
		if (currentAuctionToken !== undefined) {
			if (!Number.isInteger(tokenId)) setTokenId(currentAuctionToken);
			if (!Number.isInteger(latestTokenId) || tokenId === latestTokenId) {
				setTokenId(currentAuctionToken);
				setLatestTokenId(currentAuctionToken);
			} else setLatestTokenId(currentAuctionToken);
		}
	}, [auctionData]);

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
		<ComponentWrapper theme={theme} isDataLoaded={isDataLoaded}>
			{isDataLoaded && !auctionData?.auctionId && (
				<div id="auction">
					<div className="nbc-mx-auto nbc-flex nbc-justify-center">
						<div className="nbc-flex nbc-h-full nbc-w-full nbc-flex-col nbc-items-center nbc-text-center md:nbc-flex-row md:nbc-gap-10">
							<p className="nbc-w-full nbc-p-4 md:nbc-p-10">No auction found</p>
						</div>
					</div>
				</div>
			)}
			{isDataLoaded && auctionData?.auctionId ? (
				<div id="auction">
					<div className="nbc-mx-auto nbc-flex nbc-justify-center">
						<div className="nbc-flex nbc-w-full nbc-flex-col nbc-items-center md:nbc-flex-row md:nbc-gap-10">
							<div className="nbc-aspect-square md:nbc-w-3/5">
								{token?.imageUrl && <TokenImage imageUrl={token.imageUrl} />}
							</div>
							<div className="nbc-mt-10 nbc-mb-5 nbc-w-full sm:nbc-w-3/4 md:nbc-w-2/5">
								<div className="nbc-mb-3 nbc-flex nbc-w-full nbc-flex-row nbc-items-center nbc-gap-2 md:nbc-mb-6">
									<button
										className="nbc-text-md nbc-aspect-square nbc-rounded-full nbc-bg-gray-400 nbc-py-1 nbc-px-2 nbc-text-base nbc-font-bold nbc-leading-none nbc-opacity-70 hover:nbc-opacity-100 disabled:nbc-opacity-25"
										disabled={!tokenId || tokenId <= 0}
										onClick={() => {
											tokenId !== undefined && tokenId >= 0 && setTokenId(tokenId - 1);
										}}
									>
										←
									</button>
									<button
										className="nbc-text-md nbc-aspect-square nbc-rounded-full nbc-bg-slate-400 nbc-py-1 nbc-px-2 nbc-text-base nbc-font-bold nbc-leading-none nbc-opacity-70 hover:nbc-opacity-100 disabled:nbc-opacity-25"
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
								<h1 className="nbc-text-4xl nbc-font-bold md:nbc-text-5xl">
									{token?.name ? token?.name : <></>}
								</h1>
								{auctionData?.auctionId === tokenId ? (
									<>
										<div className="nbc-flex nbc-gap-5">
											<div className="nbc-my-5">
												<p className="nbc-text-md nbc-text-text-base nbc-opacity-40">highest bid</p>
												<p className="nbc-text-3xl nbc-font-bold nbc-text-text-base">
													Ξ {auctionData?.highestBid}
												</p>
											</div>
											<div className="nbc-my-5">
												<p className="nbc-text-md nbc-text-text-base nbc-opacity-40">
													auction ends
												</p>
												<button
													className="nbc-text-left nbc-font-bold nbc-text-text-base"
													onClick={() => {
														toggleCountdown(!showCountdown);
													}}
												>
													{showCountdown ? (
														auctionData?.endTime && (
															<span className="nbc-text-3xl">
																<Countdown
																	renderer={countdownRenderer}
																	daysInHours={true}
																	date={auctionData.endTime}
																/>
															</span>
														)
													) : (
														<>
															<span className="nbc-text-left nbc-text-lg">
																{date} {time}
															</span>
															<span className="nbc-text-left nbc-text-lg"></span>
														</>
													)}
												</button>
											</div>
										</div>
									</>
								) : (
									<>
										{auctionData?.highestBidder && (
											<div className="nbc-my-5">
												<p className="nbc-text-md nbc-text-text-base nbc-opacity-40">owned by</p>
												<p className="nbc-w-full nbc-max-w-[300px] nbc-truncate nbc-text-3xl nbc-font-bold nbc-text-text-base">
													<Account address={token.owner} chainId={dao.chainId} />
												</p>
											</div>
										)}
									</>
								)}
								{tokenId && tokenId === auctionData?.auctionId && (
									<>
										<BidForm
											auctionData={auctionData}
											formData={formData}
											dao={dao}
											theme={theme}
										/>
										{auctionData?.highestBidder !== AddressZero && (
											<div className="nbc-my-5">
												<p className="nbc-text-1xl nbc-flex nbc-w-full nbc-max-w-[300px] nbc-flex-row nbc-justify-between nbc-gap-3 nbc-truncate nbc-font-bold nbc-text-text-base">
													<Account address={auctionData?.highestBidder} chainId={dao.chainId} />
													<span className="nbc-text-md nbc-text-text-base nbc-opacity-40">
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
			) : (
				<></>
			)}
		</ComponentWrapper>
	);
};
