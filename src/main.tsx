import './index.css';
import '@rainbow-me/rainbowkit/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WagmiConfig, createClient, configureChains, mainnet, goerli } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { infuraProvider } from 'wagmi/providers/infura';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { BuilderDAO } from '../lib';

const config = document.querySelector('[data-builder-config]') as HTMLElement;
const chain = (config?.dataset.chain?.toUpperCase() as 'MAINNET' | 'GOERLI') || 'MAINNET';
const collection = config?.dataset.daoCollection || '';
const infuraId = config?.dataset.infuraKey || '';

if (!infuraId) {
	throw new Error('Infura key required. See docs for more information.');
} else if (!collection) {
	throw new Error('Collection address required. See docs for more information.');
} else if (!['MAINNET', 'GOERLI'].includes(chain)) {
	throw new Error(`Invalid chain: ${chain}. Chain must be set to mainnet or goerli.`);
}

const { chains, provider, webSocketProvider } = configureChains(
	[chain === 'GOERLI' ? goerli : mainnet],
	[infuraProvider({ apiKey: infuraId }), publicProvider()]
);

const { connectors } = getDefaultWallets({
	appName: 'DAO Components',
	chains,
});

const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider,
	webSocketProvider,
});

const components = document.querySelectorAll('[data-builder-component]');

if (!components.length) {
	throw new Error('No builder components found. See documentation for setup info.');
}

for (const component of components) {
	const root = component as HTMLElement;

	ReactDOM.createRoot(root).render(
		<React.StrictMode>
			<WagmiConfig client={wagmiClient}>
				<RainbowKitProvider chains={chains}>
					<BuilderDAO collection={collection} chain={chain}>
						<App config={root.dataset} />
					</BuilderDAO>
				</RainbowKitProvider>
			</WagmiConfig>
		</React.StrictMode>
	);
}
