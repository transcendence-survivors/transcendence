'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { THEMES, DEFAULT_THEME } from '@libs/theme';
import useThemeHotkey from '@hooks/themes/useThemeHotkey';

if (typeof window !== 'undefined' && process.env?.NODE_ENV === 'development') {
	const orig = console.error;
	console.error = (...args: unknown[]) => {
		if (typeof args[0] === 'string' && args[0].includes('Encountered a script tag'))
			return;
		orig.apply(console, args);
	};
}

const themelList: string[] = [...THEMES];

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider> & {
	themes?: readonly string[];
};

const ThemeKey = () => {
	useThemeHotkey();
	return null;
};

const ThemeProvider = ({
	children,
	themes = themelList,
	...props
}: ThemeProviderProps) => {
	return (
		<NextThemesProvider
			attribute='class'
			defaultTheme={DEFAULT_THEME}
			enableSystem
			disableTransitionOnChange
			themes={themes}
			{...props}>
			<ThemeKey />
			{children}
		</NextThemesProvider>
	);
};

export { ThemeProvider };
