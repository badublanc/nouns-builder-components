import { ConnectKitButton } from 'connectkit';
import type { DaoInfo } from '../lib/types';
import { AuctionHero, CollectionList, useDao } from '../lib';

const component = (name: string, dao: DaoInfo, config: DOMStringMap) => {
	switch (name) {
		case 'auction-hero':
			return <AuctionHero dao={dao} />;
		case 'collection-list':
			return <CollectionList dao={dao} opts={config} />;
		case 'connect-button':
			return <ConnectKitButton />;
		default:
			console.error('Component type required. See docs for more info.');
			return <></>;
	}
};

const App = ({ config }: { config: DOMStringMap }) => {
	const dao = useDao();
	const { builderComponent } = config;

	// @ts-expect-error main.tsx should error if component not specified
	return <>{!dao ? <></> : component(builderComponent, dao, config)}</>;
};

export default App;
