import { fetcher } from '@/lib/fetcher';
import {
	ForgotPasswordProps,
	ResetPasswordProps,
	SigninProps,
	SignupProps,
	ChangePasswordProps,
	VerifyEmailProps,
	RequestVerifyEmailProps,
} from '@/types/auth';
import { ApiResponse } from '@/types/global';

export const signup = async (data: SignupProps) => {
	return await fetcher<ApiResponse<null>>('/auth/register', { method: 'POST', body: JSON.stringify(data) });
};

export const signin = async (data: SigninProps) => {
	return await fetcher<ApiResponse<null>>('/auth/login', { method: 'POST', body: JSON.stringify(data) });
};

export const signout = async () => {
	return await fetcher<ApiResponse<null>>('/auth/logout', { method: 'POST' });
};

export const forgotPassword = async (data: ForgotPasswordProps) => {
	return await fetcher<ApiResponse<null>>('/auth/forgot-password', {
		method: 'POST',
		body: JSON.stringify(data),
	});
};

export const resetPassword = async (data: ResetPasswordProps) => {
	return await fetcher<ApiResponse<null>>('/auth/reset-password', {
		method: 'POST',
		body: JSON.stringify(data),
	});
};

export const changePassword = async (data: ChangePasswordProps) => {
	return await fetcher<ApiResponse<null>>('/auth/change-password', {
		method: 'POST',
		body: JSON.stringify(data),
	});
};

export const verifyEmail = async (data: VerifyEmailProps) => {
	return await fetcher<ApiResponse<null>>('/auth/verify', { method: 'POST', body: JSON.stringify(data) });
};

export const requestVerifyEmail = async (data: RequestVerifyEmailProps) => {
	return await fetcher<ApiResponse<null>>('/auth/request-verify', {
		method: 'POST',
		body: JSON.stringify(data),
	});
};

export const refreshAccessToken = async () => {
	return await fetcher<ApiResponse<{ access_token: string }>>('/auth/refresh-token', { method: 'POST' });
};
