import type { DaoConfig, DaoMember } from '../types';
import { fetchDataWithQuery } from './utils';
import { logWarning } from '../utils';

type FetchMembersOpts = {
	collection: string;
	chain: DaoConfig['chain'];
};

export const fetchMembers = async ({
	collection,
	chain,
}: FetchMembersOpts): Promise<DaoMember[]> => {
	const response = await fetchDataWithQuery(query, { collection, chain });
	if (!response) {
		logWarning('no_data_from_api', collection, chain);
		return [];
	}

	const data = formatQueryData(response, chain);
	if (!data) return [];

	return data ?? [];
};

const formatQueryData = (data: any, chain: DaoConfig['chain']): DaoMember[] | null => {
	const { data: result, errors } = data;
	const memberData = result?.aggregateStat?.ownersByCount?.nodes;

	if (errors) {
		// console.log(errors);
		logWarning('query_error', '', chain);
		return null;
	}

	const members: DaoMember[] = memberData.map((member: any): DaoMember => {
		return {
			address: member?.owner,
			tokenIds: member?.tokenIds?.map((t: string) => Number(t)),
		};
	});

	return members;
};

const query = `query GetMembers($collection: [String!]!, $chain: Chain!) {
  aggregateStat {
    ownersByCount(
      where: {collectionAddresses: $collection}
      networks: {network: ETHEREUM, chain: $chain}
      pagination: {limit: 500}
    ) {
      nodes {
        owner
        tokenIds
      }
    }
  }
}`;
