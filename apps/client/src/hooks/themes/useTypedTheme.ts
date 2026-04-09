'use client';

import { useTheme } from 'next-themes';
import { Theme } from '@libs/theme';

const useTypedTheme = () => {
	const { theme, resolvedTheme, setTheme } = useTheme();

	return {
		theme: theme as Theme | undefined,
		resolvedTheme: resolvedTheme as Theme | undefined,
		setTheme: (theme: Theme) => setTheme(theme),
	};
};

export default useTypedTheme;
