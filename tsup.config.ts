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
		// copy package.json to dist
		const pkg = fs.readFileSync('./package.json');
		fs.writeFileSync('./dist/package.json', pkg);

		// copy readme to dist
		const readme = fs.readFileSync('./readme.md');
		fs.writeFileSync('./dist/readme.md', readme);
	},
});

export default config;
