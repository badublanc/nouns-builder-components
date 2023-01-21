export type DaoConfig = {
	collection: string;
	chain: 'MAINNET' | 'GOERLI';
};

export type DaoInfo = {
	name: string;
	symbol: string;
	owners: number;
	totalSupply: number;
	contracts: {
		auction: string;
		collection: string;
		governor: string;
		metadata: string;
		treasury: string;
	};
	chain: DaoConfig['chain'];
	chainId: 1 | 5;
};

export type SortDirection = 'ASC' | 'DESC';
