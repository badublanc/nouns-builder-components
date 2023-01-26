import { ConnectKitButton } from 'connectkit';
import { AuctionHero } from '../lib';

const App = ({ component }: { component: string }) => {
	switch (component) {
		case 'connectButton':
			return <ConnectKitButton />;
		case 'auctionHero':
			return <AuctionHero />;
		default:
			return <></>;
	}
};

export default App;
