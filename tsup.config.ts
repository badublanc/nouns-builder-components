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
	noExternal: ['react-loading-skeleton/dist/skeleton.css'],
	external: [...Object.keys(PackageJSON.peerDependencies)],
	async onSuccess() {
		const vArgIndex = process.argv.findIndex((arg) => arg === '--env.PKG_VERSION');

		if (vArgIndex < 0) {
			throw new Error('Package version not found.');
		}

		const version = process.argv[vArgIndex + 1];

		// copy package.json to dist
		const pkg: Record<string, unknown> = { ...PackageJSON };
		pkg.version = version.startsWith('v') ? version.slice(1) : version;
		delete pkg.scripts;
		delete pkg.devDependencies;
		fs.writeFileSync('./dist/package.json', JSON.stringify(pkg, null, 2));

		// copy readme to dist
		const readme = fs.readFileSync('./readme.md');
		fs.writeFileSync('./dist/readme.md', readme);
	},
});

export default config;
