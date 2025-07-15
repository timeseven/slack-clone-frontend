import { useMutation } from '@tanstack/react-query';
import {
	ChangePasswordProps,
	ForgotPasswordProps,
	RequestVerifyEmailProps,
	ResetPasswordProps,
	SigninProps,
	SignupProps,
} from '@/types/auth';
import {
	changePassword,
	forgotPassword,
	requestVerifyEmail,
	resetPassword,
	signin,
	signout,
	signup,
} from '@/features/auth/services/authApi';

export const useChangePassword = () => {
	return useMutation({
		mutationFn: (data: ChangePasswordProps) => changePassword(data),
	});
};

export const useForgotPassword = () => {
	return useMutation({
		mutationFn: (data: ForgotPasswordProps) => forgotPassword(data),
	});
};

export const useRequestVerifyEmail = () => {
	return useMutation({
		mutationFn: (data: RequestVerifyEmailProps) => requestVerifyEmail(data),
	});
};

export const useResetPassword = () => {
	return useMutation({
		mutationFn: (data: ResetPasswordProps) => resetPassword(data),
	});
};

export const useSignin = () => {
	return useMutation({
		mutationFn: (data: SigninProps) => signin(data),
	});
};

export const useSignout = () => {
	return useMutation({
		mutationFn: () => signout(),
	});
};

export const useSignup = () => {
	return useMutation({
		mutationFn: (data: SignupProps) => signup(data),
	});
};
