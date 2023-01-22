import React, { useEffect } from 'react';
import { useDao } from '../..';
import { AuctionInfo } from './AuctionInfo';

export const Auction = () => {
	const dao = useDao();

	return <>{dao ? <AuctionInfo dao={dao} /> : <></>}</>;
};
