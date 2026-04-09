import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { UserRole } from '@libs/zod/user.schema';
import { CanonicalHref, routeMap } from '@i18n/routing';
import {
	COOKIE_ACCESS_TOKEN,
	COOKIE_AUTHORIZATION,
	TOKEN_PREFIX,
} from '@libs/constants/cookies';
import { env } from '../zod/env';

const secret = new TextEncoder().encode(env.JWT_SECRET);

type JWTPayload = {
	sub: string;
	role: UserRole;
	exp: number;
};

const verifyToken = async (token: string): Promise<JWTPayload> => {
	const { payload } = await jwtVerify(token, secret);
	return payload as JWTPayload;
};

export const publicRoutes = new Set<CanonicalHref>([
	routeMap.register.en,
	routeMap.login.en,
	routeMap.home.en,
	routeMap.posts.en,
]);

export const roleRoutes: Partial<Record<CanonicalHref, UserRole[]>> = {
	// [routeMap.admin.en]: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
};

const hierarchy: Record<UserRole, number> = {
	[UserRole.USER]: 1,
	[UserRole.ADMIN]: 2,
	[UserRole.SUPER_ADMIN]: 3,
};

export const hasRequiredRole = (userRole: UserRole, required: UserRole[]): boolean =>
	required.some((r) => hierarchy[userRole] >= hierarchy[r]);

export const getUserFromRequest = async (req: NextRequest) => {
	const token =
		req.cookies.get(COOKIE_ACCESS_TOKEN)?.value ||
		req.headers.get(COOKIE_AUTHORIZATION)?.replace(TOKEN_PREFIX, '');

	if (!token) return null;

	try {
		return await verifyToken(token);
	} catch {
		return null;
	}
};

export const isPublicRoute = (path: string | null): boolean => {
	if (!path) return false;
	return publicRoutes.has(path as CanonicalHref);
};
