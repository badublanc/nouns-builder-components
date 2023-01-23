import { ConnectButton } from '@rainbow-me/rainbowkit';
import { AuctionHero } from '../lib';

const App = ({ component }: { component: string }) => {
	switch (component) {
		case 'connectButton':
			return <ConnectButton />;
		case 'auctionHero':
			return <AuctionHero />;
		default:
			return <></>;
	}
};

export default App;
