import fs from 'fs';
import { defineConfig } from 'tsup';
import { peerDependencies } from './lib/package.json';

const config = defineConfig({
	entry: ['lib/index.ts'],
	outDir: './pkg',
	splitting: false,
	platform: 'browser',
	format: 'esm',
	clean: true,
	dts: true,
	external: [...Object.keys(peerDependencies)],
	async onSuccess() {
		// copy package.json to dist
		const pkg = fs.readFileSync('./lib/package.json');
		fs.writeFileSync('./pkg/package.json', pkg);

		// copy readme to dist
		// const readme = fs.readFileSync('./lib/readme.md');
		// fs.writeFileSync('./pkg/readme.md', readme);
	},
});

export default config;
