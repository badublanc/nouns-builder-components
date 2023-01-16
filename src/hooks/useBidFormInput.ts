import { BigNumber, BigNumberish } from 'ethers';
import { formatUnits, parseEther, parseUnits } from 'ethers/lib/utils.js';
import { useEffect, useState } from 'react';
import { useContractReads } from 'wagmi';
import AuctionABI from '../abis/auction';

interface UseBidFormInputConfig {
	currentBid: string;
	address: string;
}

export const useBidFormInput = ({
	currentBid,
	address,
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
				address: address as `0x${string}`,
				abi: AuctionABI,
				functionName: 'minBidIncrement',
			},
			{
				address: address as `0x${string}`,
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
		if (minBid) setPlaceholder(`${formatUnits(minBid)} or more`);
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
			min: minBid ? formatUnits(minBid) : '',
			step: 'any',
			type: 'number',
			onChange: handleChange,
		},
	};
};
