import React from 'react';
import cx from 'classnames';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import type { DaoInfo, TokenData } from '../types';
import { Account } from './shared/Account';
import TokenImage from './shared/TokenImage';

type Props = {
	token: TokenData;
	showDetails: boolean;
	dao: DaoInfo;
	inCollectionList?: boolean;
	hideLabels?: boolean;
};

export const NFT = ({ token, showDetails, dao, inCollectionList, hideLabels }: Props) => {
	const { owner, name, imageUrl, mintInfo } = token;

	return (
		<div
			className={cx(
				'nbc-flex nbc-flex-col',
				!inCollectionList && 'md:nbc-flex-row md:nbc-items-center'
			)}
		>
			<>
				<div className={cx('nbc-h-full nbc-w-full', !inCollectionList && 'nbc-md:w-2/3')}>
					<TokenImage imageUrl={imageUrl} inCollectionList={inCollectionList} />
				</div>
				{!hideLabels && (
					<div
						className={cx(
							'nbc-gap-5 nbc-rounded-md nbc-rounded-t-none nbc-py-2',
							!inCollectionList &&
								'!md:nbc-rounded-md !md:nbc-rounded-l-none md:nbc-flex md:nbc-h-full md:nbc-w-1/3 md:nbc-flex-col md:nbc-p-8'
						)}
					>
						<p
							className={cx(
								'nbc-text-md nbc-font-bold',
								inCollectionList && 'lg:nbc-text-md',
								!inCollectionList && 'nbc-text-2xl md:nbc-text-4xl'
							)}
						>
							{name || <Skeleton className="nbc-text-2xl md:nbc-text-4xl" />}
						</p>
						{showDetails && (
							<div className="nbc-grid nbc-grid-cols-12 nbc-gap-5 md:nbc-flex md:nbc-flex-col">
								<div className="nbc-col-span-4 md:nbc-col-span-6">
									<>
										<p className="nbc-text-sm nbc-text-slate-400">Owner</p>
										<p className="nbc-text-md nbc-w-full nbc-truncate nbc-font-bold">
											{owner ? (
												<Account address={owner} chainId={dao.chainId} />
											) : (
												<Skeleton className="nbc-text-md" />
											)}
										</p>
									</>
								</div>
								<div className="nbc-col-span-4 md:nbc-col-span-3">
									<p className="nbc-text-sm nbc-text-slate-400">Minted on</p>
									<p className="nbc-text-md  nbc-truncate nbc-font-bold">
										{/* note: i'm not seeing this available in the contract */}
										{/* TODO: find data for date and txn for link */}
										{mintInfo ? (
											<p className="nbc-text-md nbc-truncate nbc-font-bold">
												{new Date(mintInfo.blockTimestamp).toLocaleDateString('en-US')}
											</p>
										) : (
											<Skeleton className="nbc-text-sm" />
										)}
									</p>
								</div>

								<div className="nbc-col-span-4 md:nbc-col-span-3">
									<p className="nbc-text-sm nbc-text-slate-400">Member of</p>
									<a href={dao.external_url} rel="noopener" className="nbc-no-underline">
										{dao ? (
											<>
												{dao.imageUrl && (
													<img
														src={dao.imageUrl}
														alt={`${dao.name} logo`}
														className="nbc-rounded-md"
													/>
												)}

												<p className="nbc-text-md nbc-truncate nbc-font-bold">{dao.name}</p>
											</>
										) : (
											<Skeleton className="nbc-text-md" />
										)}
									</a>
								</div>
							</div>
						)}
					</div>
				)}
			</>
		</div>
	);
};
