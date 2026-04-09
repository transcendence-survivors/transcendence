export const THEMES = ['light', 'dark', 'neon', 'system'] as const;
export const THEME_LENGTH = THEMES.length;
export const THEME_COUNTS = THEME_LENGTH - 1;

export type ResolvedTheme = Exclude<Theme, 'system'> | null;
export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = 'system';
