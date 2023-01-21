import { BuilderDAO, Auction } from '../lib';

const App = () => {
	return (
		<BuilderDAO collection="0x73e769fcd28e66c43f785f5479b4ba8ef9886863" chain="GOERLI">
			<Auction />
		</BuilderDAO>
	);
};

export default App;
