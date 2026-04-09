import { api, ApiResponse, isApiSuccess } from '@libs/api';
import { User } from '@libs/zod/user.schema';

interface RefreshResponse {
	accessToken: string;
}

interface LoginRequestBody {
	email: string;
	password: string;
}

export const refreshAccessToken = async (): Promise<RefreshResponse> => {
	const res = await api.post<RefreshResponse>('/auth/refresh');
	if (!isApiSuccess(res)) throw new Error(res.message);
	return res.data;
};

export const getMe = async (): Promise<User> => {
	const res = await api.get<User>('/auth/me');
	if (!isApiSuccess(res)) throw new Error(res.message);
	return res.data;
};

export const logoutRequest = async (): Promise<void> => {
	await api.post<void>('/auth/logout');
};

export const loginRequest = async (
	body: LoginRequestBody,
): Promise<ApiResponse<User>> => {
	const res = await api.post<User>('/auth/login', body);
	return res;
};
