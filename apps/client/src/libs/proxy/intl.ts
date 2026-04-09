import createMiddleware from 'next-intl/middleware';
import { routing, locales } from '@i18n/routing';

export const intlMiddleware = createMiddleware(routing);

export const stripLocale = (pathname: string): string => {
	for (const locale of locales) {
		if (pathname === `/${locale}`) return '/';
		if (pathname.startsWith(`/${locale}/`))
			return pathname.slice(`/${locale}`.length);
	}
	return pathname;
};
