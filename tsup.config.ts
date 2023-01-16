import fs from 'fs';
import { defineConfig } from 'tsup';
import { peerDependencies } from './package.json';

const config = defineConfig({
	entry: ['src/index.ts'],
	outDir: './dist',
	splitting: false,
	platform: 'browser',
	format: 'esm',
	clean: true,
	dts: true,
	external: [...Object.keys(peerDependencies)],
	async onSuccess() {
		const pkg = fs.readFileSync('./package.json');
		fs.writeFileSync('./dist/package.json', pkg);
	},
});

export default config;
