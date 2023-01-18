import type { Network } from '../../types';

type GetProposalConfig = {
	id: string;
	governorAddress: string;
	network?: Network;
};

type GetProposalListConfig = {
	governorAddress: string;
	network?: Network;
	sortDirection?: 'asc' | 'desc';
};

export type QueriedProposal = {
	id: string;
	created: number;
	proposer: string;
	title: string;
	description: string;
	status: string;
	quorum: number;
	voteStart: number;
	voteEnd: number;
	votes: [];
};

export const getProposal = async ({
	id,
	governorAddress,
	network = 'mainnet',
}: GetProposalConfig): Promise<QueriedProposal | null> => {
	try {
		const props = await getProposalList({ governorAddress, network });
		if (props && props.length) {
			const prop = props.find((p) => p.id === id);
			if (prop) return prop;
		}
	} catch (error) {
		console.error(error);
		return null;
	}

	return null;
};

export const getProposalList = async ({
	governorAddress,
	network = 'mainnet',
	sortDirection = 'desc',
}: GetProposalListConfig): Promise<QueriedProposal[]> => {
	try {
		const response = await fetch('https://api.zora.co/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
			body: `{\n\t"query": "query{nouns{nounsEvents(filter:{nounsBuilderGovernorEventType:NOUNS_BUILDER_GOVERNOR_PROPOSAL_CREATED_EVENT,nounsEventTypes:NOUNS_BUILDER_GOVERNOR_EVENT}networks:{chain:${network.toUpperCase()},network:ETHEREUM}where:{governorAddresses:\\"${governorAddress}\\"}sort:{sortKey:CREATED,sortDirection:${sortDirection.toUpperCase()}}pagination:{limit:250}){nodes{properties{... on NounsBuilderGovernorEvent{__typename properties{... on NounsBuilderGovernorProposalCreatedEventProperties{proposalId proposer timeCreated quorumVotes voteStart voteEnd description}}}}}}}}",\n\t"variables": {}\n}`,
		});
		const rawData = await response.json();
		return parseProposalListQuery(rawData);
	} catch (error) {
		console.error(error);
		return [];
	}
};

export const parseProposalListQuery = (data: any): QueriedProposal[] => {
	const { nodes } = data?.data?.nouns?.nounsEvents;
	const props = nodes.map((node: any) => {
		const { properties } = node.properties;
		return {
			id: properties.proposalId,
			created: Number(properties.timeCreated),
			proposer: properties.proposer,
			quorumVotes: Number(properties.quorumVotes),
			voteStart: Number(properties.voteStart),
			voteEnd: Number(properties.voteEnd),
			title: properties.description.split('&&')[0],
			description: properties.description.split('&&').slice(1).join('&&'),
		};
	});
	return props;
};
