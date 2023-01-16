import { useEffect, useState } from 'react';
import { useContractReads } from 'wagmi';
import { GovernorABI, TokenABI } from '../abis';

interface UseDaoConfig {}

export const useDao = (governorContract: string) => {
	const [governor, setGovernor] = useState<string>('');
	const [token, setToken] = useState<string>('');
	const [treasury, setTreasury] = useState<string>('');
	const [auction, setAuction] = useState<string>('');
	const [metadata, setMetadata] = useState<string>('');
	const [name, setName] = useState<string>('');

	useEffect(() => {
		if (governorContract) setGovernor(governorContract);

		return () => {
			setGovernor('');
			setToken('');
			setTreasury('');
			setAuction('');
			setMetadata('');
			setName('');
		};
	}, [governorContract]);

	useContractReads({
		contracts: [
			{
				address: governor as `0x${string}`,
				abi: GovernorABI,
				functionName: 'token',
			},
			{
				address: governor as `0x${string}`,
				abi: GovernorABI,
				functionName: 'treasury',
			},
		],
		enabled: Boolean(governor),
		onSuccess(data) {
			setToken(data[0]);
			setTreasury(data[1]);
		},
		onError(err) {
			console.error(err);
			setToken('');
			setTreasury('');
		},
	});

	useContractReads({
		contracts: [
			{
				address: token as `0x${string}`,
				abi: TokenABI,
				functionName: 'auction',
			},
			{
				address: token as `0x${string}`,
				abi: TokenABI,
				functionName: 'metadataRenderer',
			},
			{
				address: token as `0x${string}`,
				abi: TokenABI,
				functionName: 'name',
			},
		],
		enabled: Boolean(token),
		onSuccess(data) {
			setAuction(data[0]);
			setMetadata(data[1]);
			setName(data[2]);
		},
		onError(err) {
			console.error(err);
			setAuction('');
			setMetadata('');
			setName('');
		},
	});

	return { name, addresses: { governor, token, auction, treasury, metadata } };
};
