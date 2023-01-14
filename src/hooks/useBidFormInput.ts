import { BigNumberish } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils.js';
import { useEffect, useState } from 'react';
import { useContractRead } from 'wagmi';
import AuctionABI from '../abis/auction';

type Props = {
	amount: string;
	address: string;
};

const useBidFormInput = ({ amount, address }: Props) => {
	const [value, setValue] = useState('');
	const [minBid, setMinBid] = useState<BigNumberish | null>();
	const [minBidPct, setMinBidPct] = useState<BigNumberish>();
	const [placeholder, setPlaceholder] = useState<string>('Bid amount');

	useContractRead({
		address: address as `0x${string}`,
		abi: AuctionABI,
		functionName: 'minBidIncrement',
		onSuccess(data) {
			setMinBidPct(data);
		},
	});

	useEffect(() => {
		if (amount && minBidPct) {
			const currentBid = parseUnits(amount, 'ether');
			setMinBid(currentBid.add(currentBid.div(minBidPct)));
		} else setMinBid(null);
		return () => setMinBid(null);
	}, [amount, minBidPct]);

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
			step: '0.001',
			type: 'number',
			onChange: handleChange,
		},
	};
};

export default useBidFormInput;
