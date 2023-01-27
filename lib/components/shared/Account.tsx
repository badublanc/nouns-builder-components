import React from 'react';
import { useEnsName, useEnsAvatar } from 'wagmi';
import { DaoInfo } from '../../types';
import { truncateAddress } from '../../utils';
// import Avatar from "./shared/Avatar";

type Props = {
	address: string;
	chainId: DaoInfo['chainId'];
	showAvatar?: boolean;
};

export const Account = (props: Props) => {
	const ensName = useEnsName({
		address: props.address as `0x${string}`,
		chainId: props.chainId,
	}).data;
	// const ensAvatar = useEnsAvatar({
	// 	address: props.address as `0x${string}`,
	// }).data;
	return (
		<a href={`https://etherscan.io/address/${props.address}`} className="">
			{/* <Avatar address={props.address} /> */}
			<span className="w-full overflow-hidden overflow-ellipsis">
				{ensName ? ensName : truncateAddress(props.address)}
			</span>
		</a>
	);
};
