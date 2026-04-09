import { request } from './client';

export type ApiSuccess<T> = {
	status: 'success';
	message: string;
	data: T;
};

export type ApiError = {
	status: 'error';
	message: string;
	code: number;
	errors?: unknown;
	timestamp: string;
	path: string;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export const isApiSuccess = <T>(res: ApiResponse<T>): res is ApiSuccess<T> =>
	res.status === 'success';

export const isApiError = <T>(res: ApiResponse<T>): res is ApiError =>
	res.status === 'error';

export const api = {
	get: <T>(path: string, init?: RequestInit) =>
		request<T>(path, { ...init, method: 'GET' }),

	post: <T>(path: string, body?: unknown, init?: RequestInit) =>
		request<T>(path, {
			...init,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...init?.headers,
			},
			body: body ? JSON.stringify(body) : undefined,
		}),

	put: <T>(path: string, body?: unknown, init?: RequestInit) =>
		request<T>(path, {
			...init,
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				...init?.headers,
			},
			body: body ? JSON.stringify(body) : undefined,
		}),

	delete: <T>(path: string, init?: RequestInit) =>
		request<T>(path, { ...init, method: 'DELETE' }),
};
