import { fetcher } from '@/lib/fetcher';
import { UserRead, UpdateUserMe } from '@/types/user';
import { ApiResponse } from '@/types/global';

export const getMe = async () => {
	const res = await fetcher<ApiResponse<UserRead>>('/users/me', { method: 'GET' });
	return {
		...res,
		__ts: Date.now(),
	};
};

export const updateMe = async (data: UpdateUserMe) => {
	return await fetcher<ApiResponse<UserRead>>('/users/me', {
		method: 'PATCH',
		body: JSON.stringify(data),
	});
};

export const uploadAvatar = async (data: FormData) => {
	return await fetcher<ApiResponse<UserRead>>('/users/me/upload-avatar', {
		method: 'POST',
		body: data,
	});
};

export const getUser = async (userId: string) => {
	return await fetcher<ApiResponse<UserRead>>(`/users/${userId}`, { method: 'GET' });
};
