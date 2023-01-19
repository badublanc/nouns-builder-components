# React Hooks for Nouns Builder DAOs

A collection of React hooks to kickstart development for your DAO. Supports DAOs created with the [Nouns Builder](https://nouns.build/) tool by [Zora](https://zora.co/). Initial development funded by [Builder DAO](https://nouns.build/dao/0xdf9b7d26c8fc806b1ae6273684556761ff02d422/vote/0xbb6d9919efb59b500451dd8d923201d0a7bc1ced3a8320dd57888eef9ee3c139).

Note: this library is under active development. Things will change and possibly break.

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

### 🪝 `useAddress`

Hook for fetching ENS name and avatar for an address.

```ts
import { useAddress } from '@badublanc/builder-hooks';
```

Configuration

```ts
type UseAddressConfig = {
  address: string; // valid 20-byte Ethereum address
  network?: 'mainnet' | 'goerli'; // default: 'mainnet'
};
```

### 🪝 `useAuction`

Hook for fetching data about the current, or most recent, auction for a DAO.

```ts
import { useAuction } from '@badublanc/builder-hooks';
```

Configuration

```ts
type UseAuctionConfig = {
  auctionAddress: string; // address for DAO auction house contract
  network?: 'mainnet' | 'goerli'; // default: 'mainnet'
};
```

### 🪝 `useBidForm`

Hook for handling form submissions for auction bids.

```ts
import { useBidForm } from '@badublanc/builder-hooks';
```

Configuration

```ts
type UseBidFormConfig = {
  tokenId: number;
  bidAmount: string;
  minBid: string;
  auctionAddress: string; // address for DAO auction house contract
  network?: 'mainnet' | 'goerli'; // default: 'mainnet'
};
```

### 🪝 `useBidFormInput`

Hook for handling inputs for auction bids.

```ts
import { useBidFormInput } from '@badublanc/builder-hooks';
```

Configuration

```ts
type UseBidFormInputConfig = {
  currentBid: string;
  auctionAddress: string; // address for DAO auction house contract
  network?: 'mainnet' | 'goerli'; // default: 'mainnet'
};
```

### 🪝 `useCountdown`

Hook for tracking remaining time in an auction.

```ts
import { useCountdown } from '@badublanc/builder-hooks';
```

Configuration

```ts
type UseCountdownConfig = {
  deadline: number; // timestamp
};
```

### 🪝 `useDao`

Hook for fetching on-chain DAO metadata and contract addresses.

```ts
import { useDao } from '@badublanc/builder-hooks';
```

Configuration

```ts
type UseDaoConfig = {
  governorAddress: string; // address for DAO governor contract
  network?: 'mainnet' | 'goerli'; // default: 'mainnet'
};
```

### 🪝 `useProposal`

Hook for fetching data for a proposal.

```ts
import { useProposal } from '@badublanc/builder-hooks';
```

Configuration

```ts
type UseProposalConfig = {
  id: string;
  governorAddress: string; // address for DAO governor contract
  network?: 'mainnet' | 'goerli'; // default: 'mainnet'
};
```

### 🪝 `useProposalList`

Hook for fetching a basic list of a DAO's proposals.

```ts
import { useProposalList } from '@badublanc/builder-hooks';
```

Configuration

```ts
type UseProposalListConfig = {
  governorAddress: string; // address for DAO governor contract
  sortDirection?: 'asc' | 'desc'; // default: 'desc'
  network?: 'mainnet' | 'goerli'; // default: 'mainnet'
};
```

### 🪝 `useSettleAuction`

Hook for submitting a transaction to settle an auction and starting the next one.

```ts
import { useSettleAuction } from '@badublanc/builder-hooks';
```

Configuration

```ts
type UseSettleAuctionConfig = {
  auctionAddress: string; // address for DAO auction house contract
  network?: 'mainnet' | 'goerli'; // default: 'mainnet'
};
```

### 🪝 `useToken`

Hook for fetching data for a token in the DAO collection.

```ts
import { useToken } from '@badublanc/builder-hooks';
```

Configuration

```ts
type UseTokenConfig = {
  tokenId: number;
  tokenAddress: string; // address for DAO token/nft contract
  network?: 'mainnet' | 'goerli'; // default: 'mainnet'
};
```
