import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import rollupNodePolyFill from 'rollup-plugin-polyfill-node';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	optimizeDeps: {
		esbuildOptions: {
			// Node.js global to browser globalThis
			define: {
				global: 'globalThis',
			},
			// Enable esbuild polyfill plugins
			plugins: [
				NodeGlobalsPolyfillPlugin({
					buffer: true,
					// process: true,
				}),
				NodeModulesPolyfillPlugin(),
			],
		},
	},
	build: {
		rollupOptions: {
			plugins: [rollupNodePolyFill()],
			output: {
				entryFileNames: '[name].js',
				assetFileNames: '[name][extname]',
				chunkFileNames: 'chunks-[name].js',
			},
		},
	},
});
