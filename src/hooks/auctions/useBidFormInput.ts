import type { Network } from '../../types';
import { utils, BigNumber, type BigNumberish } from 'ethers';
import { useEffect, useState } from 'react';
import { useContractReads } from 'wagmi';
import AuctionABI from '../../abis/auction';
import { getChainIdFromNetwork } from '../../utils';
const { formatEther, parseEther } = utils;

interface UseBidFormInputConfig {
	currentBid: string;
	auctionAddress: string;
	network?: Network;
}

export const useBidFormInput = ({
	currentBid,
	auctionAddress,
	network = 'mainnet',
}: UseBidFormInputConfig) => {
	const [value, setValue] = useState('');
	const [reservePrice, setReservePrice] = useState<BigNumberish>(
		parseEther('0.0001')
	);
	const [minBid, setMinBid] = useState<BigNumberish>();
	const [minBidPct, setMinBidPct] = useState<BigNumberish>();
	const [placeholder, setPlaceholder] = useState<string>('Bid amount');

	useContractReads({
		contracts: [
			{
				address: auctionAddress as `0x${string}`,
				chainId: getChainIdFromNetwork(network),
				abi: AuctionABI,
				functionName: 'minBidIncrement',
			},
			{
				address: auctionAddress as `0x${string}`,
				chainId: getChainIdFromNetwork(network),
				abi: AuctionABI,
				functionName: 'reservePrice',
			},
		],
		onSuccess(data) {
			setMinBidPct(data[0]);
			if (data[1]) setReservePrice(data[1]);
		},
	});

	useEffect(() => {
		if (currentBid) {
			const bid = parseEther(currentBid);
			if (bid.gt(BigNumber.from('0')) && minBidPct) {
				setMinBid(bid.add(bid.div(minBidPct)));
			} else setMinBid(reservePrice);
		} else setMinBid(reservePrice);
		return () => setMinBid(reservePrice);
	}, [currentBid, minBidPct, reservePrice]);

	useEffect(() => {
		if (minBid) setPlaceholder(`${formatEther(minBid)} or more`);
		else setPlaceholder('Bid amount');
		return () => setPlaceholder('Bid amount');
	}, [minBid]);

	const handleChange = (event: any) => {
		setValue(event.target.value);
	};

	return {
		attributes: {
			value,
			placeholder,
			min: minBid ? formatEther(minBid) : '',
			step: 'any',
			type: 'number',
			onChange: handleChange,
		},
	};
};
