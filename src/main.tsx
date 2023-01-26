import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WagmiConfig, createClient, configureChains, mainnet, goerli } from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { ConnectKitProvider, getDefaultClient } from 'connectkit';
import { BuilderDAO } from '../lib';

const config = document.querySelector('[data-builder-config]') as HTMLElement;
const chain = config?.dataset.chain?.toUpperCase() as 'MAINNET' | 'GOERLI';
const infuraId = config?.dataset.infuraKey || '';

if (!infuraId) {
	throw new Error('Infura key required. See docs for more information.');
}

const { chains, provider, webSocketProvider } = configureChains(
	[chain === 'GOERLI' ? goerli : mainnet],
	[infuraProvider({ apiKey: infuraId })]
);

const client = createClient(
	getDefaultClient({
		appName: 'Builder Components',
		autoConnect: true,
		chains,
		provider,
		webSocketProvider,
	})
);

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
				<ConnectKitProvider>
					<BuilderDAO collection={collection} chain={chain}>
						<App component={component} />
					</BuilderDAO>
				</ConnectKitProvider>
			</WagmiConfig>
		</React.StrictMode>
	);
}
