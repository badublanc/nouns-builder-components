import './index.css';
import '@rainbow-me/rainbowkit/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { WagmiConfig, createClient, configureChains, mainnet, goerli } from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';

const { chains, provider, webSocketProvider } = configureChains(
	[mainnet, goerli],
	[infuraProvider({ apiKey: 'cfe94335ab724354835fefb844aa0db7' })]
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

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<WagmiConfig client={client}>
			<RainbowKitProvider chains={chains}>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</RainbowKitProvider>
		</WagmiConfig>
	</React.StrictMode>
);
