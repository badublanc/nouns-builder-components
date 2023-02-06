import { Theme, ThemeConfig } from '../types';
import { themes } from '.';

export function getThemeStyles(theme: Theme) {
	if (theme === 'dark') return themes.dark;
	return themes.base;
}

export function applyTheme(element: HTMLElement, theme: Theme) {
	const themeStyles = getThemeStyles(theme);
	Object.keys(themeStyles).forEach((cssVar) => {
		element.style.setProperty(cssVar, themeStyles[cssVar as keyof typeof themeStyles]);
	});
}

export function createTheme(config: ThemeConfig) {
	return {
		'--theme-primary': config.primary,
		'--theme-secondary': config.secondary,
		'--theme-text-base': config.textBase,
		'--theme-background': config.background,
		'--theme-border': config.border,
	};
}
