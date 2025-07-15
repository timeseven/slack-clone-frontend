import { useMutation } from '@tanstack/react-query';
import { uploadFile, deleteFile } from '@/features/file/services/fileApi';

export const useUploadFile = () => {
	return useMutation({
		mutationFn: (formData: FormData) => uploadFile(formData),
	});
};

export const useDeleteFile = () => {
	return useMutation({
		mutationFn: (file_id: string) => deleteFile(file_id),
	});
};
