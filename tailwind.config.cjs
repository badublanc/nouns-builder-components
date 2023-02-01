/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './lib/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				primary: 'var(--theme-primary)',
				secondary: 'var(--theme-secondary)',
				'text-base': 'var(--theme-text-base)',
				background: 'var(--theme-background)',
				'theme-border': 'var(--theme-border)',
			},
		},
	},
	variants: {
		extend: {},
	},
	safelist: [
		{
			pattern: /grid-cols-([1-9]|1[0-2])/,
		},
	],
	plugins: [require('@tailwindcss/typography'), require('@tailwindcss/line-clamp')],
};
