import React, { useContext, useEffect, useState } from 'react';
import { useContractRead } from 'wagmi';
import type { DaoInfo } from '../types';
import { DaoContext } from '../context';
import { fetchDaoData } from '../queries';
import { TokenABI } from '../abis';

type DaoURI = {
	name: string;
	description: string;
	imageUrl: string;
	website: string;
};

const ipfsGateway = 'https://gateway.pinata.cloud/ipfs/';

export const useDao = (): DaoInfo | null => {
	const ctx = useContext(DaoContext);

	const [apiData, setApiData] = useState<Partial<DaoInfo>>();
	const [contractUri, setContractUri] = useState<DaoURI>();

	useContractRead({
		enabled: Boolean(ctx.collection),
		address: ctx.collection as `0x${string}`,
		chainId: ctx.chain === 'GOERLI' ? 5 : 1,
		abi: TokenABI,
		functionName: 'contractURI',
		onSuccess(data) {
			const uri = JSON.parse(window.atob(data.split(',')[1]));
			if (uri?.image) uri.image = uri.image.replace('ipfs://', ipfsGateway);

			const daoUri: DaoURI = {
				name: uri?.name ?? '',
				description: uri?.description ?? '',
				imageUrl: uri?.image ?? '',
				website: uri?.external_url ?? '',
			};

			setContractUri(daoUri);
		},
		onError(err) {
			console.error(err);
		},
	});

	useEffect(() => {
		const fetchData = async () => {
			const { collection, chain } = ctx;
			const data = await fetchDaoData({ collection, chain });
			if (data) setApiData(data);
			else {
				console.error('dao data not returned from zora');
			}
		};

		if (ctx.collection && ctx.chain) fetchData();
	}, [ctx]);

	return contractUri && apiData ? ({ ...contractUri, ...apiData } as DaoInfo) : null;
};
