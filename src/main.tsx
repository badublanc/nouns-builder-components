import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WagmiConfig, createClient, configureChains, mainnet, goerli } from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { ConnectKitProvider, getDefaultClient } from 'connectkit';
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
	[infuraProvider({ apiKey: infuraId })]
);

const client = createClient(
	getDefaultClient({
		appName: 'DAO Components',
		autoConnect: true,
		chains,
		provider,
		webSocketProvider,
	})
);

const components = document.querySelectorAll('[data-builder-component]');

if (!components.length) {
	throw new Error('No builder components found. See documentation for setup info.');
}

for (const component of components) {
	const root = component as HTMLElement;
	const config = root.dataset;

	ReactDOM.createRoot(root).render(
		<React.StrictMode>
			<WagmiConfig client={client}>
				<ConnectKitProvider>
					<BuilderDAO collection={collection} chain={chain}>
						<App config={config} />
					</BuilderDAO>
				</ConnectKitProvider>
			</WagmiConfig>
		</React.StrictMode>
	);
}
