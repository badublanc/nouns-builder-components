import { BuilderDAO, AuctionHero } from '../lib';

const App = () => {
	return (
		<BuilderDAO collection="0x73e769fcd28e66c43f785f5479b4ba8ef9886863" chain="GOERLI">
			<AuctionHero />
		</BuilderDAO>
	);
};

export default App;
