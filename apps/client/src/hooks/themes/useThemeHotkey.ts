'use client';

import { useCallback, useEffect } from 'react';
import useTypedTheme from './useTypedTheme';
import { THEME_LENGTH, THEMES } from '@libs/theme';

const isTypingTarget = (target: EventTarget | null) => {
	if (!(target instanceof HTMLElement)) return false;

	return (
		target.isContentEditable ||
		target.tagName === 'INPUT' ||
		target.tagName === 'TEXTAREA' ||
		target.tagName === 'SELECT'
	);
};

const useThemeHotkey = () => {
	const { theme, resolvedTheme, setTheme } = useTypedTheme();

	const onKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (!event?.key) return;
			if (
				event.defaultPrevented ||
				event.repeat ||
				event.metaKey ||
				event.ctrlKey ||
				event.altKey
			)
				return;

			if (event.key.toLowerCase() !== 'd') return;
			if (isTypingTarget(event.target)) return;

			const current = resolvedTheme ?? theme;

			if (!current) return;
			const currentThemeIndex = THEMES.indexOf(current);

			const nextTheme = THEMES[(currentThemeIndex + 1) % THEME_LENGTH];

			setTheme(
				nextTheme !== 'system'
					? nextTheme
					: THEMES[(currentThemeIndex + 2) % THEME_LENGTH],
			);
		},
		[theme, resolvedTheme, setTheme],
	);

	useEffect(() => {
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [onKeyDown]);
};

export default useThemeHotkey;
