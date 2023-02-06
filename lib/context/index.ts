import type { DaoConfig } from '../types';
import React, { createContext } from 'react';

export const DaoContext = createContext<DaoConfig>({
	collection: '',
	chain: 'MAINNET',
});

export const BuilderDAO = ({ collection, chain, children }: React.PropsWithChildren<DaoConfig>) => {
	return React.createElement(DaoContext.Provider, {
		children: React.createElement('div', {
			children,
			context: DaoContext,
		}),
		value: { collection, chain },
	});
};
