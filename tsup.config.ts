import fs from 'fs';
import { defineConfig } from 'tsup';
import PackageJSON from './package.json';

const config = defineConfig({
	entry: ['lib/index.ts'],
	outDir: './dist',
	splitting: false,
	platform: 'browser',
	format: 'esm',
	clean: true,
	dts: true,
	external: [...Object.keys(PackageJSON.peerDependencies)],
	async onSuccess() {
		// copy package.json to dist
		const pkg: Record<string, unknown> = { ...PackageJSON };
		delete pkg.scripts;
		delete pkg.devDependencies;
		fs.writeFileSync('./dist/package.json', JSON.stringify(pkg, null, 2));

		// copy readme to dist
		const readme = fs.readFileSync('./readme.md');
		fs.writeFileSync('./dist/readme.md', readme);
	},
});

export default config;
