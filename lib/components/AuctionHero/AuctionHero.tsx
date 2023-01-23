import React, { useEffect } from 'react';
import { useDao } from '../..';
import { Hero } from './Hero';

export const AuctionHero = () => {
	const dao = useDao();

	return <>{dao ? <Hero dao={dao} /> : <></>}</>;
};
