import './index.css';
import '@rainbow-me/rainbowkit/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WagmiConfig, createClient, configureChains, mainnet, goerli } from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { BuilderDAO } from '../lib';

const config = document.querySelector('[data-builder-config]') as HTMLElement;
const chain = config?.dataset.chain?.toUpperCase() as 'MAINNET' | 'GOERLI';
const apiKey = config?.dataset.infuraKey || '';

if (!apiKey) {
	throw new Error('Infura key required. See docs for more information.');
}

const { chains, provider, webSocketProvider } = configureChains(
	[chain === 'GOERLI' ? goerli : mainnet],
	[infuraProvider({ apiKey })]
);

const { connectors } = getDefaultWallets({
	appName: 'builder-hooks',
	chains,
});

const client = createClient({
	autoConnect: true,
	connectors,
	provider,
	webSocketProvider,
});

const roots = document.querySelectorAll('[data-builder-component]');
const daoNotRequired = ['connectButton'];

for (const root of roots) {
	const component = (root as HTMLElement)?.dataset.builderComponent || '';
	const collection = (root as HTMLElement)?.dataset.daoCollection || '';

	if (!component) {
		console.warn('component type required.');
		break;
	} else if (!daoNotRequired.includes(component) && !collection) {
		console.warn(`collection required for ${component}`);
		break;
	}

	ReactDOM.createRoot(root).render(
		<React.StrictMode>
			<WagmiConfig client={client}>
				<RainbowKitProvider chains={chains}>
					<BuilderDAO collection={collection} chain={chain}>
						<App component={component} />
					</BuilderDAO>
				</RainbowKitProvider>
			</WagmiConfig>
		</React.StrictMode>
	);
}
