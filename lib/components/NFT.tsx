import React from 'react';
import cx from 'classnames';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import type { DaoInfo, TokenData } from '../types';
import { Account } from './shared/Account';

type Props = {
	token: TokenData;
	showDetails: boolean;
	dao: DaoInfo;
	inCollectionList?: boolean;
	hideLabels?: boolean;
};

export const NFT = ({ token, showDetails, dao, inCollectionList, hideLabels }: Props) => {
	const { owner, name, imageUrl, mintInfo } = token;

	const [isImageLoaded, setIsImageLoaded] = React.useState(false);
	const [isImageError, setIsImageError] = React.useState(false);

	return (
		<div className={cx('flex flex-col', !inCollectionList && 'md:flex-row md:items-center')}>
			<>
				<div className={cx('w-full h-full', !inCollectionList && 'md:w-2/3')}>
					<img
						src={imageUrl}
						style={isImageLoaded ? {} : { display: 'none' }}
						onLoad={() => setIsImageLoaded(true)}
						onError={() => setIsImageError(true)}
						className={cx(
							'rounded-md w-full',
							!inCollectionList && 'rounded-b-none !md:rounded-md !md:rounded-r-none'
						)}
						alt={`${name} token image`}
					/>

					{/* Show placeholder until image is loaded */}
					<div
						style={
							!isImageLoaded && !isImageError
								? { display: 'block', height: '100%' }
								: { display: 'none' }
						}
					>
						<Skeleton
							containerClassName="h-full w-full rounded-md rounded-b-none !md:rounded-md !md:rounded-r-none"
							className="aspect-square"
						/>
					</div>
				</div>
				{!hideLabels && (
					<div
						className={cx(
							'py-2 rounded-md rounded-t-none gap-5',
							!inCollectionList &&
								'md:p-8 !md:rounded-md !md:rounded-l-none md:flex md:flex-col md:h-full md:w-1/3'
						)}
					>
						<p
							className={cx(
								'text-md font-bold',
								inCollectionList && 'lg:text-md',
								!inCollectionList && 'text-2xl md:text-4xl'
							)}
						>
							{name || <Skeleton className="text-2xl md:text-4xl" />}
						</p>
						{showDetails && (
							<div className="grid grid-cols-12 gap-5 md:flex md:flex-col">
								<div className="col-span-4 md:col-span-6">
									<>
										<p className="text-sm text-slate-400">Owner</p>
										<p className="text-md truncate font-bold w-full">
											{owner ? (
												<Account address={owner} chainId={dao.chainId} />
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
										{mintInfo ? (
											<p className="text-md truncate font-bold">
												{new Date(mintInfo.blockTimestamp).toLocaleDateString('en-US')}
											</p>
										) : (
											<Skeleton className="text-sm" />
										)}
									</p>
								</div>

								<div className="col-span-4 md:col-span-3">
									<p className="text-sm text-slate-400">Member of</p>
									<a href={dao.external_url} rel="noopener" className="no-underline">
										{dao ? (
											<>
												{dao.imageUrl && (
													<img src={dao.imageUrl} alt={`${dao.name} logo`} className="rounded-md" />
												)}

												<p className="text-md truncate font-bold">{dao.name}</p>
											</>
										) : (
											<Skeleton className="text-md" />
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
