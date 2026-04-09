import { defineRouting } from 'next-intl/routing';

export const defaultLocale = 'fr';
export const locales = [defaultLocale, 'en', 'de'] as const;
export type Locale = (typeof locales)[number];

type StrictRouteMap<T extends Record<string, Record<Locale, `/${string}`>>> = T & {
	[K in keyof T]: {
		[L in keyof T[K]]: L extends Locale ? T[K][L] : never;
	};
};

const defineRouteMap = <T extends Record<string, Record<Locale, `/${string}`>>>(
	map: StrictRouteMap<T>,
): T => map as T;

export const routeMap = defineRouteMap({
	home: {
		en: '/',
		de: '/',
		fr: '/',
	},
	register: {
		en: '/register',
		de: '/registrieren',
		fr: '/inscription',
	},
	login: {
		en: '/login',
		de: '/anmelden',
		fr: '/connexion',
	},
	game: {
		en: '/game',
		de: '/spiel',
		fr: '/jeu',
	},
	leaderboard: {
		en: '/leaderboard',
		de: '/rangliste',
		fr: '/classement',
	},
	profile: {
		en: '/profile',
		de: '/profil',
		fr: '/profil',
	},
	settings: {
		en: '/settings',
		de: '/einstellungen',
		fr: '/parametres',
	},
	posts: {
		en: '/posts',
		de: '/beitraege',
		fr: '/articles',
	},
	postId: {
		en: '/posts/:id',
		de: '/beitraege/:id',
		fr: '/articles/:id',
	},
	postIdMediaId: {
		en: '/posts/:id/media/:mediaId',
		de: '/beitraege/:id/medien/:mediaId',
		fr: '/articles/:id/media/:mediaId',
	},
} as const);

export type RouteMap = typeof routeMap;
export type RouteKey = keyof RouteMap;
export type CanonicalHref = RouteMap[RouteKey]['en'];
export const authRedirectRoute: CanonicalHref = routeMap.home.en;

export const getRoute = <K extends RouteKey, L extends Locale = typeof defaultLocale>(
	key: K,
	locale: L = defaultLocale as L,
): RouteMap[K][L] => routeMap[key][locale];

export const getPath = (key: RouteKey): CanonicalHref => routeMap[key].en;

export const resolveRoute = (key: RouteKey, locale: Locale) => {
	return getRoute(key, locale);
};

export const routing = defineRouting({
	locales,
	defaultLocale,
	pathnames: Object.fromEntries(
		Object.values(routeMap).map((value) => [value.en, value]),
	) as Record<string, Record<Locale, string>>,
});
