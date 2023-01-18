# React Hooks for Builder DAOs

Note: this library is under active development. Things will change and possibly break.

## Setup

Install the package and it's dependincies.

```bash
# npm
npm i @badublanc/builder-hooks wagmi ethers

# yarn
yarn add @badublanc/builder-hooks wagmi ethers
```

Configure the wagmi client and wrap your app with `WagmiConfig`. Further instructions can be found [here](https://wagmi.sh/react/getting-started).

```js
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

That's it. Now, you're ready to use the hooks!

```js
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
