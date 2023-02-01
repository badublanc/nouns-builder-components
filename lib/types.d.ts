export type SortDirection = 'ASC' | 'DESC';

export type Theme = 'base' | 'dark' | undefined;

export type ThemeConfig = {
	primary: string;
	secondary: string;
	textBase: string;
	background: string;
	border: string;
};

export type DaoConfig = {
	collection: string;
	chain: 'MAINNET' | 'GOERLI';
};

export type DaoInfo = {
	name: string;
	symbol: string;
	description?: string;
	imageUrl?: string;
	external_url?: string;
	owners: number;
	totalSupply: number;
	chain: DaoConfig['chain'];
	chainId: 1 | 5;
	contracts: {
		auction: string;
		collection: string;
		governor: string;
		metadata: string;
		treasury: string;
	};
};

export type AuctionData = {
	auctionId: number;
	chain: DaoConfig['chain'];
	startTime: number;
	endTime: number;
	highestBid: string;
	highestBidder: string;
	minPctIncrease: string;
};

export type CollectionData = {
	name: string;
	image?: string;
	website?: string;
	tokens: TokenData[];
};

export type TokenData = {
	id: number;
	owner: string;
	name: string;
	description: string;
	imageUrl: string;
	chain: DaoConfig['chain'];
	attributes: Record<string, any>;
	auctionInfo?: {
		tokenId: number;
		winner: string;
		amount: string;
		startTime: number;
		endTime: number;
	};
	mintInfo?: {
		blockNumber: number;
		blockTimestamp: number;
		transactionHash: string;
	};
};

export type DaoMember = {
	address: string;
	tokenIds: number[];
};
