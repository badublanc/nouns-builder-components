import type { Network } from '../types';
import { useEffect, useState } from 'react';
import { useContractReads } from 'wagmi';
import { GovernorABI, TokenABI } from '../abis';
import { getChainIdFromNetwork } from '../utils';

interface UseDaoConfig {
	governorAddress: string;
	network?: Network;
}

export const useDao = ({
	governorAddress,
	network = 'mainnet',
}: UseDaoConfig) => {
	const [tokenAddress, setTokenAddress] = useState<string>('');
	const [treasuryAddress, setTreasuryAddress] = useState<string>('');
	const [auctionAddress, setAuctionAddress] = useState<string>('');
	const [metadataAddress, setMetadataAddress] = useState<string>('');
	const [name, setName] = useState<string>('');

	const resetValues = () => {
		setTokenAddress('');
		setTreasuryAddress('');
		setAuctionAddress('');
		setMetadataAddress('');
		setName('');
	};

	useEffect(() => {
		if (!governorAddress) resetValues();
		return () => resetValues();
	}, [governorAddress]);

	useContractReads({
		contracts: [
			{
				address: governorAddress as `0x${string}`,
				chainId: getChainIdFromNetwork(network),
				abi: GovernorABI,
				functionName: 'token',
			},
			{
				address: governorAddress as `0x${string}`,
				chainId: getChainIdFromNetwork(network),
				abi: GovernorABI,
				functionName: 'treasury',
			},
		],
		enabled: Boolean(governorAddress),
		onSuccess(data) {
			setTokenAddress(data[0]);
			setTreasuryAddress(data[1]);
		},
		onError(err) {
			console.error(err);
			setTokenAddress('');
			setTreasuryAddress('');
		},
	});

	useContractReads({
		contracts: [
			{
				address: tokenAddress as `0x${string}`,
				chainId: getChainIdFromNetwork(network),
				abi: TokenABI,
				functionName: 'auction',
			},
			{
				address: tokenAddress as `0x${string}`,
				chainId: getChainIdFromNetwork(network),
				abi: TokenABI,
				functionName: 'metadataRenderer',
			},
			{
				address: tokenAddress as `0x${string}`,
				chainId: getChainIdFromNetwork(network),
				abi: TokenABI,
				functionName: 'name',
			},
		],
		enabled: Boolean(tokenAddress),
		onSuccess(data) {
			setAuctionAddress(data[0]);
			setMetadataAddress(data[1]);
			setName(data[2]);
		},
		onError(err) {
			console.error(err);
			setAuctionAddress('');
			setMetadataAddress('');
			setName('');
		},
	});

	return {
		dao: {
			name,
		},
		governorAddress,
		tokenAddress,
		treasuryAddress,
		auctionAddress,
		metadataAddress,
	};
};
