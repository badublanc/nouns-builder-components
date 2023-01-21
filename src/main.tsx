import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
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

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<WagmiConfig client={client}>
			<App />
		</WagmiConfig>
	</React.StrictMode>
);
