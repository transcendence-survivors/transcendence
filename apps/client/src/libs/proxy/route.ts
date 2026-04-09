import { routing } from '@i18n/routing';

const buildDynamicRouteRegex = (path: string): RegExp =>
	new RegExp(
		`^${path
			.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
			.replace(/:[^/]+/g, '[^/]+')}(/.*)?$`,
	);

export const resolveCanonicalPath = (deLocalizedPath: string): string | null => {
	for (const [enPath, localeMap] of Object.entries(routing.pathnames)) {
		for (const localizedPath of Object.values(localeMap as Record<string, string>)) {
			if (buildDynamicRouteRegex(localizedPath).test(deLocalizedPath))
				return enPath;
		}
	}
	return null;
};
