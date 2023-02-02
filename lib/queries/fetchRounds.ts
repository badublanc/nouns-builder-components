import type { PHRoundData } from '../types';
import { fetchDataWithQuery } from './utils';
import { logWarning } from '../utils';

type FetchRoundsOpts = {
	collection: string;
};

export const fetchRounds = async ({ collection }: FetchRoundsOpts): Promise<PHRoundData[]> => {
	const response = await fetchDataWithQuery(
		query,
		{ collection },
		'https://prod.backend.prop.house/graphql'
	);
	if (!response) {
		logWarning('no_data_from_api', collection);
		return [];
	}

	const data = formatQueryData(response);
	if (!data) return [];

	return data;
};

const formatQueryData = (data: any): PHRoundData[] | null => {
	const { data: result, errors } = data;
	const communityData = result?.findByAddress;
	const roundData = result?.findByAddress?.auctions;

	if (errors) {
		// console.log(errors);
		logWarning('query_error', '');
		return null;
	}

	const rounds: PHRoundData[] = roundData.map((round: any): PHRoundData => {
		return {
			communityId: communityData?.id,
			communityName: communityData?.name,
			id: round?.id,
			status: round?.status,
			title: round?.title,
			startTime: new Date(round?.startTime).valueOf(),
			proposalEndTime: new Date(round?.proposalEndTime).valueOf(),
			votingEndTime: new Date(round?.votingEndTime).valueOf(),
			numWinners: round?.numWinners,
			fundingAmount: round?.fundingAmount,
			currency: round?.currencyType,
			description: round?.description,
			proposalCount: round?.proposals?.length ?? 0,
			proposalIds: round?.proposals?.map((p: any): number => p.id),
		};
	});

	return rounds.sort((a, b) => b.id - a.id);
};

const query = `query GetRounds($collection: String!) {
  findByAddress(address: $collection) {
    id
		name
    auctions {
      id
      status
      title
      startTime
      proposalEndTime
      votingEndTime
      numWinners
      fundingAmount
      currencyType
      description
      proposals {
        id
      }
    }
  }
}`;
