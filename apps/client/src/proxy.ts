import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { intlMiddleware, stripLocale } from '@proxy/intl';
import { resolveCanonicalPath } from '@proxy/route';
import {
	getUserFromRequest,
	hasRequiredRole,
	isPublicRoute,
	roleRoutes,
} from '@proxy/auth';
import { CanonicalHref, routeMap } from '@i18n/routing';

const REDIRECTED_URLS = {
	403: routeMap.login.en,
	loggin: routeMap.login.en,
} satisfies Record<string, CanonicalHref>;

export default async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	const intlResponse = intlMiddleware(req);
	if (intlResponse?.headers.get('location')) return intlResponse;

	const canonical = resolveCanonicalPath(stripLocale(pathname));

	if (isPublicRoute(canonical)) {
		return intlResponse ?? NextResponse.next();
	}

	const user = await getUserFromRequest(req);
	if (!user) {
		const url = new URL(REDIRECTED_URLS.loggin, req.url);
		url.searchParams.set('callbackUrl', pathname);
		return NextResponse.redirect(url);
	}

	const routeKey = canonical as CanonicalHref;
	const requiredRoles = roleRoutes[routeKey];
	if (requiredRoles && !hasRequiredRole(user.role, requiredRoles)) {
		return NextResponse.redirect(new URL(REDIRECTED_URLS['403'], req.url));
	}

	return intlResponse ?? NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
};
