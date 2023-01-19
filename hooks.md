# 🔱 Hooks

Note: this library is pre-release and in active development. Things will change and possibly break.

| hook               |                                                                                   |                               |
| ------------------ | --------------------------------------------------------------------------------- | ----------------------------- |
| `useAddress`       | Hook for fetching ENS name and avatar for an address.                             | [Usage →](#-useaddress)       |
| `useAuction`       | Hook for fetching data about the current, or most recent, auction for a DAO.      | [Usage →](#-useauction)       |
| `useBidForm`       | Hook for handling form submissions for auction bids.                              | [Usage →](#-usebidform)       |
| `useBidFormInput`  | Hook for handling inputs for auction bids.                                        | [Usage →](#-usebidforminput)  |
| `useCountdown`     | Hook for tracking remaining time in an auction.                                   | [Usage →](#-usecountdown)     |
| `useDao`           | Hook for fetching on-chain DAO metadata and contract addresses.                   | [Usage →](#-usedao)           |
| `useProposal`      | Hook for fetching data for a proposal.                                            | [Usage →](#-useproposal)      |
| `useProposalList`  | Hook for fetching a basic list of a DAO's proposals.                              | [Usage →](#-useproposallist)  |
| `useSettleAuction` | Hook for submitting a transaction to settle an auction and starting the next one. | [Usage →](#-usesettleauction) |
| `useToken`         | Hook for fetching data for a token in the DAO collection.                         | [Usage →](#-usetoken)         |

---

### 🪝 `useAddress`

Hook for fetching ENS name and avatar for an address.

```ts
import { useAddress } from '@badublanc/builder-hooks';
```

⚙️ Configuration

```ts
type UseAddressConfig = {
  address: string; // valid 20-byte Ethereum address
  network?: 'mainnet' | 'goerli'; // default: 'mainnet'
};
```

↩️ Returns

```dts
{
	displayName: string; // ens or shortAddress
	address: string;
	shortAddress: string; // eg: 0x1234...6789
	avatar: string;
}
```

📝 Usage

```tsx
import { useAddress } from '@badublanc/builder-hooks';

export default function App() {
  const myAddress = '0x4DA67068FD02F2abCdC5A09cE7b4dD28C31d8C97';
  const { displayName, avatar } = useAddress({ address: myAddress });

  return (
    <div>
      {avatar && (
        <img src={avatar} alt="avatar" style={{ width: 100, height: 100 }} />
      )}
      {displayName && <p>{displayName}</p>}
    </div>
  );
}
```

---

### 🪝 `useAuction`

Hook for fetching data about the current, or most recent, auction for a DAO.

```ts
import { useAuction } from '@badublanc/builder-hooks';
```

⚙️ Configuration

```ts
type UseAuctionConfig = {
  auctionAddress: string; // DAO auction house contract
  network?: 'mainnet' | 'goerli'; // default: 'mainnet'
};
```

↩️ Returns

```dts
{
	tokenId: number;
	highestBid: string;
	highestBidder: string;
	startTime: number;
	endTime: number;
	settled: boolean;
}
```

📝 Usage

```tsx
import { useAuction } from '@badublanc/builder-hooks';

export default function App() {
  return <div></div>;
}
```

---

### 🪝 `useBidForm`

Hook for handling form submissions for auction bids.

```ts
import { useBidForm } from '@badublanc/builder-hooks';
```

⚙️ Configuration

```ts
type UseBidFormConfig = {
  tokenId: number;
  bidAmount: string;
  minBid: string;
  auctionAddress: string; // DAO auction house contract
  network?: 'mainnet' | 'goerli'; // default: 'mainnet'
};
```

↩️ Returns

```dts
{
	attributes: {
		onSubmit: (event: any) => void;
	};
}
```

📝 Usage

```tsx
import { useBidForm, useBidFormInput } from '@badublanc/builder-hooks';

export default function App() {
  return <div></div>;
}
```

---

### 🪝 `useBidFormInput`

Hook for handling inputs for auction bids.

```ts
import { useBidFormInput } from '@badublanc/builder-hooks';
```

⚙️ Configuration

```ts
type UseBidFormInputConfig = {
  currentBid: string;
  auctionAddress: string; // DAO auction house contract
  network?: 'mainnet' | 'goerli'; // default: 'mainnet'
};
```

↩️ Returns

```dts
{
	attributes: {
		value: string;
		placeholder: string;
		min: string;
		step: string;
		type: string;
		onChange: (event: any) => void;
	};
}
```

📝 Usage

```tsx
import { useBidForm, useBidFormInput } from '@badublanc/builder-hooks';

export default function App() {
  return <div></div>;
}
```

---

### 🪝 `useCountdown`

Hook for tracking remaining time in an auction.

```ts
import { useCountdown } from '@badublanc/builder-hooks';
```

⚙️ Configuration

```ts
type UseCountdownConfig = {
  deadline: number; // timestamp
};
```

↩️ Returns

```dts
{
	countdown: string;
	isActive: boolean;
	timeUnits: {
		hours: number;
		minutes: number;
		seconds: number;
	};
}
```

📝 Usage

```tsx
import { useCountdown } from '@badublanc/builder-hooks';

export default function App() {
  return <div></div>;
}
```

---

### 🪝 `useDao`

Hook for fetching on-chain DAO metadata and contract addresses.

```ts
import { useDao } from '@badublanc/builder-hooks';
```

⚙️ Configuration

```ts
type UseDaoConfig = {
  governorAddress: string; // DAO governor contract
  network?: 'mainnet' | 'goerli'; // default: 'mainnet'
};
```

↩️ Returns

```dts
{
	dao: {
		name: string;
	};
	governorAddress: string;
	tokenAddress: string;
	treasuryAddress: string;
	auctionAddress: string;
	metadataAddress: string;
}
```

📝 Usage

```tsx
import { useDao } from '@badublanc/builder-hooks';

export default function App() {
  return <div></div>;
}
```

---

### 🪝 `useProposal`

Hook for fetching data for a proposal.

```ts
import { useProposal } from '@badublanc/builder-hooks';
```

⚙️ Configuration

```ts
type UseProposalConfig = {
  id: string;
  governorAddress: string; // DAO governor contract
  network?: 'mainnet' | 'goerli'; // default: 'mainnet'
};
```

↩️ Returns

```dts
{
	created: number | undefined;
	proposer: string;
	title: string;
	description: string;
	status: string;
	quorum: number | undefined;
	voteStart: number | undefined;
	voteEnd: number | undefined;
	votes: object[];
}
```

📝 Usage

```tsx
import { useProposal } from '@badublanc/builder-hooks';

export default function App() {
  return <div></div>;
}
```

---

### 🪝 `useProposalList`

Hook for fetching a basic list of a DAO's proposals.

```ts
import { useProposalList } from '@badublanc/builder-hooks';
```

⚙️ Configuration

```ts
type UseProposalListConfig = {
  governorAddress: string; // DAO governor contract
  sortDirection?: 'asc' | 'desc'; // default: 'desc'
  network?: 'mainnet' | 'goerli'; // default: 'mainnet'
};
```

↩️ Returns

```dts
[
	{
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
	},
	{ ... }
]
```

📝 Usage

```tsx
import { useProposalList } from '@badublanc/builder-hooks';

export default function App() {
  return <div></div>;
}
```

---

### 🪝 `useSettleAuction`

Hook for submitting a transaction to settle an auction and starting the next one.

```ts
import { useSettleAuction } from '@badublanc/builder-hooks';
```

⚙️ Configuration

```ts
type UseSettleAuctionConfig = {
  auctionAddress: string; // DAO auction house contract
  network?: 'mainnet' | 'goerli'; // default: 'mainnet'
};
```

↩️ Returns

```dts
{
	settleAuction: () => void
}
```

📝 Usage

```tsx
import { useSettleAuction } from '@badublanc/builder-hooks';

export default function App() {
  return <div></div>;
}
```

---

### 🪝 `useToken`

Hook for fetching data for a token in the DAO collection.

```ts
import { useToken } from '@badublanc/builder-hooks';
```

⚙️ Configuration

```ts
type UseTokenConfig = {
  tokenId: number;
  tokenAddress: string; // DAO token/nft contract
  network?: 'mainnet' | 'goerli'; // default: 'mainnet'
};
```

↩️ Returns

```dts
{
	tokenId: number;
	name: string;
	description: string;
	imageUrl: string;
	traits: Record<string, any>;
}
```

📝 Usage

```tsx
import { useToken } from '@badublanc/builder-hooks';

export default function App() {
  return <div></div>;
}
```
