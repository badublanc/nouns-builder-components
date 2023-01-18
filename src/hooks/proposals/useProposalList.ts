import { useEffect, useState } from "react";
import { getProposalList, type QueriedProposal } from "./utils";

interface UseProposalListConfig {
  governorAddress: string;
  network?: "MAINNET" | "GOERLI";
  sortDirection?: "ASC" | "DESC";
}

export const useProposalList = ({
  governorAddress,
  network = "MAINNET",
  sortDirection = "DESC",
}: UseProposalListConfig) => {
  const [proposals, setProposals] = useState<QueriedProposal[]>([]);

  useEffect(() => {
    const fetchProposals = async () => {
      const props = await getProposalList({
        governorAddress,
        network,
        sortDirection,
      });
      if (props && props.length) setProposals(props);
      else setProposals([]);
    };

    if (governorAddress) fetchProposals();
    else setProposals([]);

    return () => setProposals([]);
  }, [governorAddress, network, sortDirection]);

  return proposals;
};
