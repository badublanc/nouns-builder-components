import React, { useEffect, useRef } from 'react';
import { applyTheme } from '../themes/utils';
import type { Theme } from '../types';

type Props = { theme?: 'base' | 'dark' | undefined; children: React.ReactNode };

function ComponentWrapper(props: Props) {
	const ref = useRef(null);
	const theme = props.theme as Theme;

	useEffect(() => {
		if (ref.current != null) {
			const target = ref.current as HTMLElement;
			applyTheme(target, theme);
		}
	}, [theme, ref]);
	return (
		<div className={'text-text-base bg-background p-2 md:p-5 rounded-lg'} ref={ref}>
			{props.children}
		</div>
	);
}

export default ComponentWrapper;
