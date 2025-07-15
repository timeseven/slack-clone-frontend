import { useQuery, useMutation } from '@tanstack/react-query';
import { UserRead, UpdateUserMe } from '@/types/user';
import { getMe, updateMe, getUser, uploadAvatar } from '@/features/user/services/userApi';

export const useGetMe = (options = {}) => {
	return useQuery({
		queryKey: ['me'],
		queryFn: getMe,
		select: (response: { data: UserRead }) => {
			const user = { ...response.data };
			if (user.avatar) {
				user.avatar = `${user.avatar}?t=${Date.now()}`;
			}
			return user;
		},
		enabled: true,
		...options,
	});
};

export const useUpdateMe = () => {
	return useMutation({
		mutationFn: (data: UpdateUserMe) => updateMe(data),
	});
};

export const useGetUser = (userId: string, options = {}) => {
	return useQuery({
		queryKey: ['user', userId],
		queryFn: () => getUser(userId),
		select: (response: { data: UserRead }) => response.data,
		enabled: !!userId,
		...options,
	});
};

export const useUploadAvatar = () => {
	return useMutation({
		mutationFn: (formData: FormData) => uploadAvatar(formData),
	});
};
