'use client';

import React from 'react';
import { useEffect, useState } from 'react';

import { z } from 'zod';
import Image from 'next/image';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Loading from '@/components/svg/Loading';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { WorkspaceRead } from '@/types/workspace';
import useRouteStore from '@/stores/useRouteStore';
import { queryClient } from '@/context/ReactQueryContext';
import { ACCEPTED_IMAGE_MIME_TYPES, MAX_FILE_SIZE } from '@/consts/file';

import useWorkspaceStore from '@/features/workspace/stores/useWorkspaceStore';
import { useDeleteFile, useUploadFile } from '@/features/file/hooks/useFileApiHooks';
import {
	useCreateWorkspace,
	useDeleteWorkspace,
	useUpdateWorkspace,
} from '@/features/workspace/hooks/useWorkspaceApiHooks';

const formSchema = z.object({
	id: z.string().optional(),
	name: z.string().trim().min(2, {
		message: 'Workspace name must be at least 2 characters.',
	}),
	logo: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;
const WorkspaceDetailDialog = ({
	dialogOpen,
	setDialogOpen,
	initialData,
}: {
	dialogOpen: boolean;
	setDialogOpen: (open: boolean) => void;
	initialData?: WorkspaceRead;
}) => {
	const { resetRoute, setCurrentMenu } = useRouteStore();
	const { setCurrentWorkspaceId, resetWorkspace } = useWorkspaceStore();

	const uploadFile = useUploadFile();
	const deleteFile = useDeleteFile();
	const createWorkspace = useCreateWorkspace();
	const updateWorkspace = useUpdateWorkspace();
	const deleteWorkspace = useDeleteWorkspace();

	const [isRedirecting, setIsRedirecting] = useState(false);
	const [logoPreview, setLogoPreview] = useState<string | null>(initialData?.logo ?? null);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: initialData?.id || '',
			name: initialData?.name || '',
			logo: initialData?.logo || undefined,
		},
	});

	const validateLogo = (file: File | null) => {
		if (!file) return true;
		if (file.size > MAX_FILE_SIZE) {
			toast.error('Max image size is 5MB.');
			return false;
		}
		if (!ACCEPTED_IMAGE_MIME_TYPES.includes(file.type)) {
			toast.error('Only .jpg, .jpeg, .png and .webp files are allowed.');
			return false;
		}
		return true;
	};

	const handleUploadLogo = async (file: File) => {
		const formData = new FormData();
		formData.append('file', file);

		try {
			const response = await uploadFile.mutateAsync(formData);
			const data = response?.data;
			setLogoPreview(URL.createObjectURL(file));
			form.setValue('logo', data.file_id);
		} catch (error) {
			console.log(error);
		}
	};

	const removeLogo = async () => {
		const file = form.getValues('logo');
		if (!file) return;
		try {
			let file_id = file;
			if (file.includes('amazonaws')) {
				file_id = file.split('amazonaws.com/')[1].split('.')[0];
			}
			await deleteFile.mutateAsync(file_id);
			setLogoPreview(null);
			form.setValue('logo', undefined);
		} catch (error) {
			toast.error(`Failed to remove logo: ${error}`);
		}
	};

	const onSubmit = async (values: FormValues) => {
		try {
			if (values.id) {
				await updateWorkspace.mutateAsync({
					workspaceId: values.id,
					data: {
						logo: values.logo,
						name: values.name,
					},
				});
			} else {
				// Call mutation to create workspace with values and logo file
				const response = await createWorkspace.mutateAsync({ name: values.name, logo: values.logo });

				const data = response?.data;

				// Mark as redirecting to disable UI or show spinner
				setIsRedirecting(true);

				// If workspace ID returned, reset routes and update UI state
				if (data?.workspace_id) {
					resetRoute();
					setCurrentMenu('Home');
					resetWorkspace();
					setCurrentWorkspaceId(data?.workspace_id);
				}
			}
			setDialogOpen(false);
			// Invalidate workspaces query for creation
			if (!initialData) {
				queryClient.invalidateQueries({ queryKey: ['workspaces'] });
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			// Extract error message for display
			const errorMessage = err.message || 'Workspace creation failed. Please try again.';
			// Show toast notification for error feedback
			toast.error(errorMessage);
		}
	};

	const handleDelete = async () => {
		try {
			await deleteWorkspace.mutateAsync(initialData?.id || '');
		} catch (error) {
			toast.error(`Failed to delete workspace: ${error}`);
		}
	};

	useEffect(() => {
		if (dialogOpen) {
			requestAnimationFrame(() => {
				form.setFocus('name');
			});
		}
	}, [dialogOpen, form]);

	// Cleanup URL object on unmount
	useEffect(() => {
		return () => {
			if (logoPreview) {
				URL.revokeObjectURL(logoPreview);
			}
		};
	}, [logoPreview]);

	useEffect(() => {
		if (initialData) {
			form.reset({
				id: initialData.id || '',
				name: initialData.name || '',
				logo: initialData.logo || undefined,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialData]);

	useEffect(() => {
		if (initialData?.logo && typeof initialData.logo === 'string') {
			setLogoPreview(initialData.logo);
		}
	}, [initialData]);

	const isSubmitting = form.formState.isSubmitting || createWorkspace.status === 'pending' || isRedirecting;

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogContent className='border-none bg-transparent p-0 sm:max-w-[425px]'>
				<DialogHeader className='sr-only'>
					<DialogTitle>Workspace Dialog</DialogTitle>
					<DialogDescription>Manage your workspace</DialogDescription>
				</DialogHeader>
				<Card>
					<CardHeader>
						<CardTitle className='text-2xl'>{initialData ? 'Update Workspace' : 'Create Workspace'}</CardTitle>
						<CardDescription>
							{initialData ? 'Update your workspace details' : 'Create a new workspace to collaborate with your team'}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
								<FormField
									control={form.control}
									name='name'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Workspace Name</FormLabel>
											<FormControl>
												<Input placeholder='Your workspace name' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className='space-y-2'>
									<FormLabel>Logo</FormLabel>
									{logoPreview ? (
										<div className='relative h-24 w-24 overflow-hidden rounded-md border'>
											<Image
												src={logoPreview || '/placeholder.svg'}
												alt='Logo preview'
												className='h-full w-full object-cover'
												width={96}
												height={96}
											/>
											<Button
												type='button'
												variant='destructive'
												size='icon'
												className='absolute top-1 right-1 h-6 w-6'
												onClick={removeLogo}
											>
												<X className='h-4 w-4' />
											</Button>
										</div>
									) : (
										<div>
											<Label
												htmlFor='logo'
												className='bg-background hover:bg-secondary/50 flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed pt-5 pb-6'
											>
												<Upload className='text-muted-foreground mb-2 h-8 w-8' />
												<p className='text-muted-foreground mb-1 text-sm'>
													<span className='font-semibold'>Click to upload</span> or drag and drop
												</p>
												<p className='text-muted-foreground text-xs'>JPEG, JPG, PNG, WEBP (max. 5MB)</p>
												<Input
													id='logo'
													type='file'
													onChange={(e) => {
														const file = e.target.files?.[0];
														if (file && validateLogo(file)) handleUploadLogo(file);
													}}
													accept='image/*'
													className='hidden'
												/>
											</Label>
										</div>
									)}
								</div>

								<div className='flex items-center justify-end gap-x-3'>
									<Button type='submit' disabled={isSubmitting}>
										{isSubmitting ? <Loading size='sm' /> : initialData ? 'Update' : 'Create'}
									</Button>
									{initialData && (
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button
													type='button'
													variant='destructive'
													disabled={isSubmitting || initialData?.membership?.role !== 'owner'}
												>
													Delete
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>Delete Workspace</AlertDialogTitle>
													<AlertDialogDescription>
														This action cannot be undone. This will permanently delete your workspace. And users who are
														working in the workspace will be removed from the workspace.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>Cancel</AlertDialogCancel>
													<AlertDialogAction
														className={buttonVariants({ variant: 'destructive' })}
														onClick={handleDelete}
													>
														Delete
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									)}
								</div>
							</form>
						</Form>
					</CardContent>
				</Card>
			</DialogContent>
		</Dialog>
	);
};

export default WorkspaceDetailDialog;
