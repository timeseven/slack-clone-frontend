import { fetcher } from '@/lib/fetcher';
import { FileCreateRead } from '@/types/file';
import { ApiResponse } from '@/types/global';

export const uploadFile = async (data: FormData) => {
	return await fetcher<ApiResponse<FileCreateRead>>('/files/upload', {
		method: 'POST',
		body: data,
	});
};

export const deleteFile = async (file_id: string) => {
	return await fetcher<ApiResponse<null>>(`/files/${file_id}`, {
		method: 'DELETE',
	});
};
