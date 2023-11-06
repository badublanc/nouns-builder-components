import React, { useEffect, useMemo, useState } from 'react';
import { zorbImageDataURI } from '@zoralabs/zorb';
import { AddressZero } from '../../constants';
import type { DaoInfo } from '../../types';
import { fetchEnsData } from '../../utils';

type AvatarConfig = {
	address: string;
	chainId?: DaoInfo['chainId'];
};

export const Avatar = ({ address }: AvatarConfig) => {
	const [ensAvatar, setEnsAvatar] = useState<string>('');

	const zorbImage = useMemo(() => {
		if (address) return zorbImageDataURI(address);
		else return zorbImageDataURI(AddressZero);
	}, [address]);

	useEffect(() => {
		const getEnsData = async (address: string) => {
			const { avatar } = await fetchEnsData(address);
			if (avatar) setEnsAvatar(avatar);
			else setEnsAvatar('');
		};
		if (address) getEnsData(address);
		else setEnsAvatar('');
	}, [address]);

	return (
		<img src={ensAvatar || zorbImage} className="nbc-aspect-square nbc-w-full nbc-rounded-full" />
	);
};
