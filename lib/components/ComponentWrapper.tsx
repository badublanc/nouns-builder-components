import React, { useEffect, useRef } from 'react';
import { applyTheme } from '../themes/utils';
import type { Theme } from '../types';
import LoadingImage from './shared/LoadingImage';

type Props = {
	theme?: 'base' | 'dark' | undefined;
	children: React.ReactNode;
	isDataLoaded: boolean;
};

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
		<div
			className={'nbc-rounded-lg nbc-bg-background nbc-p-2 nbc-text-text-base md:nbc-p-5'}
			ref={ref}
		>
			{!props.isDataLoaded ? (
				<div className="nbc-mx-auto nbc-flex nbc-h-full nbc-w-full nbc-items-center nbc-justify-center nbc-p-4 md:nbc-p-10">
					<LoadingImage theme={theme} />
				</div>
			) : (
				props.children
			)}
		</div>
	);
}

export default ComponentWrapper;
