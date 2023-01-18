import { useState, useEffect } from "react";
import { getProposal } from "./utils";

interface UseProposalConfig {
  id: string;
  governorAddress: string;
  network?: "MAINNET" | "GOERLI";
}

export const useProposal = ({
  id,
  governorAddress,
  network = "MAINNET",
}: UseProposalConfig) => {
  const [created, setCreated] = useState<number>();
  const [proposer, setProposer] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [quorum, setQuorum] = useState<number>();
  const [voteStart, setVoteStart] = useState<number>();
  const [voteEnd, setVoteEnd] = useState<number>();
  const [votes, setVotes] = useState<object[]>([]);

  const resetValues = () => {
    setCreated(0);
    setProposer("");
    setTitle("");
    setDescription("");
    setStatus("");
    setQuorum(0);
    setVoteStart(0);
    setVoteEnd(0);
    setVotes([]);
  };

  useEffect(() => {
    const fetchProposal = async () => {
      const proposal = await getProposal({ id, governorAddress, network });
      if (proposal) {
        setCreated(proposal.created);
        setProposer(proposal.proposer);
        setTitle(proposal.title);
        setDescription(proposal.description);
        setQuorum(proposal.quorum);
        setVoteStart(proposal.voteStart);
        setVoteEnd(proposal.voteEnd);
      } else resetValues();
    };

    if (id && governorAddress) {
      fetchProposal();
    } else resetValues();

    return () => resetValues();
  }, [id, governorAddress, network]);

  useEffect(() => {
    if (voteStart && voteEnd) {
      const now = Math.floor(Date.now() / 1000);

      // check if prop is cancelled

      // check if voting period is open
      if (now < voteStart) setStatus("Pending");
      else if (now >= voteStart && now <= voteEnd) setStatus("Active");
      else {
        // calculate votes & check for defeated, queued, executed statuses
      }
    } else setStatus("");

    return () => setStatus("");
  }, [voteStart, voteEnd]);

  return {
    created,
    proposer,
    title,
    description,
    status,
    quorum,
    voteStart,
    voteEnd,
    votes,
  };
};
