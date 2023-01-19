# React Hooks for Nouns Builder

A collection of React hooks to kickstart development for your DAO. Supports DAOs created with the [Nouns Builder](https://nouns.build/) tool by [Zora](https://zora.co/). Initial development funded by [Builder DAO](https://nouns.build/dao/0xdf9b7d26c8fc806b1ae6273684556761ff02d422/vote/0xbb6d9919efb59b500451dd8d923201d0a7bc1ced3a8320dd57888eef9ee3c139).

Note: this library is pre-release and in active development. Things will change and possibly break.

## 🛠️ Installation

```bash
# npm
npm i @badublanc/builder-hooks wagmi ethers

# yarn
yarn add @badublanc/builder-hooks wagmi ethers
```

## ⚡️ Quick start

Configure the wagmi client and wrap your app with `WagmiConfig`. Further instructions can be found at [wagmi.sh](https://wagmi.sh/react/getting-started).

```ts
import { WagmiConfig, createClient, configureChains, mainnet } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

const { provider, webSocketProvider } = configureChains(
  [mainnet],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

export default function App() {
  return (
    <WagmiConfig client={client}>
      <YourRoutes />
    </WagmiConfig>
  );
}
```

Now, you're ready to use the hooks!

```ts
import { useDao, useToken } from '@badublanc/builder-hooks';

export default function App() {
  const governorAddress = '0xe3F8d5488C69d18ABda42FCA10c177d7C19e8B1a'; // Builder DAO
  const { dao, tokenAddress } = useDao({ governorAddress });
  const { name, imageUrl, traits } = useToken({
    tokenId: 4,
    tokenAddress,
  });

  return (
    <div>
      {dao.name && <p>{dao.name}</p>}
      {imageUrl && (
        <img src={imageUrl} alt="token" style={{ width: 500, height: 500 }} />
      )}
      {name && <p>{name}</p>}
      {traits &&
        Object.entries(traits).map(([trait, value], i) => {
          return (
            <p key={i}>
              {trait}: {value}
            </p>
          );
        })}
    </div>
  );
}
```

## 🔱 Hooks

See docs for [configuration and usage examples](/hooks.md) for each hook. Note: this library is pre-release and in active development. Things will change and possibly break.

| hook               |                                                                                   |
| ------------------ | --------------------------------------------------------------------------------- |
| `useAddress`       | Hook for fetching ENS name and avatar for an address.                             |
| `useAuction`       | Hook for fetching data about the current, or most recent, auction for a DAO.      |
| `useBidForm`       | Hook for handling form submissions for auction bids.                              |
| `useBidFormInput`  | Hook for handling inputs for auction bids.                                        |
| `useCountdown`     | Hook for tracking remaining time in an auction.                                   |
| `useDao`           | Hook for fetching on-chain DAO metadata and contract addresses.                   |
| `useProposal`      | Hook for fetching data for a proposal.                                            |
| `useProposalList`  | Hook for fetching a basic list of a DAO's proposals.                              |
| `useSettleAuction` | Hook for submitting a transaction to settle an auction and starting the next one. |
| `useToken`         | Hook for fetching data for a token in the DAO collection.                         |
