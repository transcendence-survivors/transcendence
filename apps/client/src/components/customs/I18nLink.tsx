import type { ReactNode, ComponentProps } from 'react';
import { Link } from '@i18n/navigation';
import { getPath, type RouteMap, type RouteKey, type Locale } from '@i18n/routing';

type LinkProps = ComponentProps<typeof Link>;

type HasMoreSegments<T extends string> =
	T extends `${string}:${infer Param}/${infer Rest}`
		? Param | ExtractParams<`/${Rest}`>
		: never;

type HasFinalParam<T extends string> = T extends `${string}:${infer Param}`
	? Param
	: never;

type ExtractParams<T extends string> =
	HasMoreSegments<T> extends never ? HasFinalParam<T> : HasMoreSegments<T>;

type RouteParams<K extends RouteKey> = ExtractParams<RouteMap[K]['en']>;

type Params<K extends RouteKey> =
	RouteParams<K> extends never ? undefined : Record<RouteParams<K>, string | number>;



type I18nLinkProps<K extends RouteKey> = Omit<LinkProps, 'href'> & {
	href: K;
	locale?: Locale;
	params?: Params<K>;
	children: Readonly<ReactNode>;
	
};

const resolveHref = (path: string, params?: Record<string, string | number>): string =>
	params
		? Object.entries(params).reduce(
				(acc, [key, value]) => acc.replace(`:${key}`, String(value)),
				path,
			)
		: path;

export const I18nLink = <K extends RouteKey>({
	href,
	locale,
	params,
	children,
	...rest
}: I18nLinkProps<K>) => (
	<Link href={resolveHref(getPath(href), params)} locale={locale} {...rest}>
		{children}
	</Link>
);

export default I18nLink;
