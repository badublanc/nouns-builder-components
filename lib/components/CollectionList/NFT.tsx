import React from 'react';
import cx from 'classnames';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import type { DaoInfo, TokenData } from '../../types';
import { useToken } from '../..';
import { Account } from '../shared/Account';

type Props = {
	token: TokenData;
	showDetails: boolean;
	dao: DaoInfo;
	darkMode?: boolean;
	inCollectionList?: boolean;
};

export const NFT = ({ token, showDetails, dao, darkMode, inCollectionList }: Props) => {
	return (
		<div
			className={cx(
				'flex flex-col bg-white text-slate-700',
				darkMode && 'dark:bg-slate-800 dark:text-white',
				!inCollectionList && 'md:flex-row md:items-center'
			)}
		>
			<>
				<div className={cx('w-full', !inCollectionList && 'md:w-2/3')}>
					{token ? (
						<img
							src={token.imageUrl}
							alt={token.name}
							className={cx(
								'rounded-md',
								!inCollectionList && 'rounded-b-none !md:rounded-md !md:rounded-r-none'
							)}
						/>
					) : (
						<Skeleton
							containerClassName="h-full w-full rounded-md rounded-b-none !md:rounded-md !md:rounded-r-none"
							className="aspect-square"
						/>
					)}
				</div>
				<div
					className={cx(
						'py-2 rounded-md rounded-t-none gap-5',
						!inCollectionList &&
							'md:p-8 !md:rounded-md !md:rounded-l-none md:flex md:flex-col md:h-full md:w-1/3'
					)}
				>
					<p
						className={cx(
							'text-lg font-bold',
							inCollectionList && 'lg:text-xl',
							!inCollectionList && 'text-2xl md:text-4xl'
						)}
					>
						{/* TODO: get url for this specific token */}
						<a>{token?.name || <Skeleton className="text-2xl md:text-4xl" />}</a>
					</p>
					{showDetails && (
						<div className="grid grid-cols-12 gap-5 md:flex md:flex-col">
							<div className="col-span-4 md:col-span-6">
								<>
									<p className="text-sm text-slate-400">Owner</p>
									<p className="text-md truncate font-bold w-full">
										{token.owner ? (
											<Account address={token.owner} chainId={dao.chainId} />
										) : (
											<Skeleton className="text-md" />
										)}
									</p>
								</>
							</div>
							<div className="col-span-4 md:col-span-3">
								<p className="text-sm text-slate-400">Minted on</p>
								<p className="text-md  truncate font-bold">
									{/* note: i'm not seeing this available in the contract */}
									{/* TODO: find data for date and txn for link */}
									{token.auctionInfo ? (
										<p className="text-md truncate font-bold">
											{' '}
											{new Date(token.auctionInfo?.startTime).toLocaleDateString('en-US')}
										</p>
									) : (
										<Skeleton className="text-sm" />
									)}
								</p>
							</div>

							<div className="col-span-4 md:col-span-3">
								<p className="text-sm text-slate-400">Member of</p>
								{/* <a
							href={props.dao?.external_url}
							rel="noopener"
							className="no-underline"
						>
							{daoData ? (
								<>
									{image && (
										<img
											src={image}
											alt={`${props.dao.name} logo`}
											className="rounded-md"
										/>
									)}

									<p className="text-md truncate font-bold">
										{props.dao.name}
									</p>
								</>
							) : (
								<Skeleton className="text-md" />
							)}
						</a> */}
							</div>
						</div>
					)}
				</div>
			</>
		</div>
	);
};
