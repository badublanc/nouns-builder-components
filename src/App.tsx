import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { DaoInfo } from '../lib/types';
import { AuctionHero, CollectionList, MemberList, ProposalList, Treasury, useDao } from '../lib';

export default function App({ config }: { config: DOMStringMap }) {
	const dao = useDao();
	const type = config.builderComponent;

	if (!dao || !type) return <></>;
	return component(type, dao, config);
}

const component = (name: string, dao: DaoInfo, config: DOMStringMap) => {
	switch (name) {
		case 'auction-hero':
			return <AuctionHero dao={dao} opts={config} />;
		case 'collection-list':
			return <CollectionList dao={dao} opts={config} />;
		case 'connect-button':
			return <ConnectButton />;
		case 'member-list':
			return <MemberList dao={dao} opts={config} />;
		case 'proposal-list':
			return <ProposalList dao={dao} opts={config} />;
		case 'treasury':
			return <Treasury dao={dao} opts={config} />;
		default:
			console.error('Component type required. See docs for more info.');
			return <></>;
	}
};
