import React, { useEffect } from 'react';
import { useAuction } from '..';

export const Auction = () => {
	const { auctionData, tokenData, formData } = useAuction();

	const handleSubmit = (event: any) => {
		event.preventDefault();
		console.log('placing bid...');
	};
	return (
		<div id="auction" className="p-10 lg:p-20 col-span-2 w-full">
			<div className="flex justify-center">
				<div className="w-full md:max-w-[75vw] flex flex-col md:flex-row md:gap-10 items-center">
					<div className="md:w-3/5 aspect-square">
						{tokenData.imageUrl ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img src={tokenData.imageUrl} className="rounded-lg w-full" alt="" />
						) : (
							<></>
						)}
					</div>
					<div className="my-10 w-full sm:w-3/4 md:w-2/5">
						<div className="flex flex-row items-center w-full gap-2 mb-3 md:mb-6">
							<button
								className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded-full text-sm aspect-square disabled:bg-gray-100 leading-none"
								disabled={!tokenData.id || tokenData.id <= 0}
								// onClick={() => {
								//   tokenData.id !== undefined &&
								//     tokenData.id >= 0 &&
								//     setTokenId(tokenId - 1);
								// }}
							>
								←
							</button>
							<button
								className="bg-slate-400 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded-full text-sm aspect-square disabled:bg-gray-100 leading-none"
								disabled={auctionData?.auction === tokenData?.id}
								// onClick={() => {
								//   auctionData?.tokenId !== undefined &&
								//     auctionData.tokenId < auctionData?.tokenId &&
								//     setTokenId(auctionData.tokenId.toNumber() + 1);
								// }}
							>
								→
							</button>
						</div>
						<h1 className="text-4xl md:text-5xl bold text-gray-800">
							{tokenData?.name ? tokenData?.name : <></>}
						</h1>
						{auctionData.isActive ? (
							<>
								<div className="flex gap-5">
									<div className="my-5">
										<p className="text-md text-gray-700 opacity-70">highest bid</p>
										<p className="text-3xl font-bold text-gray-800">Ξ {auctionData?.highestBid}</p>
										{auctionData?.highestBidder && (
											<div className="text-md text-gray-700 truncate w-full mt-2">
												{/* <Account address={auctionData?.highestBidder} /> */}
											</div>
										)}
									</div>
									<div className="my-5">
										<p className="text-md text-gray-700 opacity-70">auction ends</p>
										<button
											className="font-bold text-gray-800"
											// onClick={() => {
											//   setIsCountdownDisplayed(!isCountdownDisplayed);
											// }}
										>
											{/* {isCountdownDisplayed ? (
                        auctionData?.endTime ? (
                          <span className="text-3xl">
                            <Countdown
                              renderer={countdownRenderer}
                              daysInHours={true}
                              date={auctionData.endTime * 1000}
                            />
                          </span>
                        ) : (
                          <></>
                        )
                      ) : (
                        <>
                          <span className="text-left text-lg block">
                            {date}
                          </span>
                          <span className="text-left text-lg">{time}</span>
                        </>
                      )} */}
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
											{/* <Account address={auctionData.highestBidder} /> */}
										</p>
									</div>
								)}
							</>
						)}
						{/* {auctionData?.highestBid && (
              <BidForm highestBid={auctionData.highestBid} />
            )} */}
					</div>
				</div>
			</div>
		</div>
	);
};
