import type { DaoConfig, ProposalData, ProposalVote } from '../types';
import { fetchDataWithQuery } from './utils';
import { logWarning } from '../utils';

type FetchProposalOpts = {
	collection: string;
	chain: DaoConfig['chain'];
};

export const fetchProposals = async ({
	collection,
	chain,
}: FetchProposalOpts): Promise<ProposalData[]> => {
	const response = await fetchDataWithQuery(query, { collection, chain });
	if (!response) {
		logWarning('no_data_from_api', collection, chain);
		return [];
	}

	const data = formatQueryData(response, chain);
	if (!data) return [];

	return data;
};

const formatQueryData = (data: any, chain: DaoConfig['chain']): ProposalData[] | null => {
	const { data: result, errors } = data;
	const props = result?.nouns?.nounsProposals?.nodes;

	if (errors) {
		console.log(errors);
		logWarning('query_error', '', chain);
		return null;
	}

	const proposals = props.map((prop: any): ProposalData => {
		return {
			id: prop?.proposalId,
			number: prop?.proposalNumber,
			created: prop?.timeCreated * 1000,
			proposer: prop?.proposer,
			title: prop?.title,
			description: prop?.description,
			status: prop?.status?.charAt(0) + prop?.status?.slice(1).toLowerCase(),
			quorum: prop?.quorumVotes,
			voteStart: prop?.voteStart * 1000,
			voteEnd: prop?.voteEnd * 1000,
			tally: {
				for: prop?.forVotes,
				against: prop?.againstVotes,
				abstain: prop?.abstainVotes,
			},
			votes:
				prop?.votes?.map((vote: any): ProposalVote => {
					return {
						voter: vote?.voter,
						weight: vote?.weight,
						support: vote?.support?.charAt(0) + vote?.support?.slice(1).toLowerCase(),
						reason: vote?.reason,
					};
				}) ?? [],
		};
	});

	return proposals;
};

const query = `query GetProposals($collection: [String!], $chain: Chain!) {
  nouns {
    nounsProposals(
      where: {collectionAddresses: $collection}
      networks: {network: ETHEREUM, chain: $chain}
      sort: {sortKey: CREATED, sortDirection: DESC}
      pagination: {limit: 500}
    ) {
      nodes {
        proposalId
        proposalNumber
        timeCreated
        proposer
        title
        status
        quorumVotes
        voteStart
        voteEnd
        forVotes
        againstVotes
        abstainVotes
        votes {
          voter
          weight
          support
          reason
        }
      }
    }
  }
}`;
