'use client';

import { useState } from 'react';

import { z } from 'zod';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { Input } from '@/components/ui/input';
import Loading from '@/components/svg/Loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import useAuthStore from '@/features/auth/stores/useAuthStore';
import { useJoinWorkspace } from '@/features/workspace/hooks/useWorkspaceApiHooks';

// Create different schemas based on type
const rookieFormSchema = z
	.object({
		email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
		full_name: z.string().min(1, { message: 'Name is required' }),
		password: z
			.string()
			.min(1, { message: 'Password is required' })
			.min(8, { message: 'Password must be at least 8 characters' }),
		confirm_password: z.string().min(1, { message: 'Confirm password is required' }),
	})
	.refine((data) => data.password === data.confirm_password, {
		path: ['confirm_password'],
		message: 'Passwords do not match',
	});

// Empty schema for join type
const joinFormSchema = z.object({});

type RookieFormValues = z.infer<typeof rookieFormSchema>;
type JoinFormValues = z.infer<typeof joinFormSchema>;

const JoinWorkspaceForm = ({ type }: { type: 'rookie' | 'join' }) => {
	const joinWorkspace = useJoinWorkspace();
	const setIsWorkspaceJoinSuccess = useAuthStore((state) => state.setIsWorkspaceJoinSuccess);
	const params = useParams();
	const searchParams = useSearchParams();
	const navigate = useRouter();
	const workspaceId = params.workspaceId as string;
	const token = searchParams.get('token');
	const workspaceName = searchParams.get('workspace_name');
	const email = searchParams.get('email');
	const [isRedirecting, setIsRedirecting] = useState(false);

	// Use the appropriate form and schema based on type
	const isRookie = type === 'rookie';

	const rookieForm = useForm<RookieFormValues>({
		resolver: zodResolver(rookieFormSchema),
		defaultValues: {
			email: email || '',
			full_name: '',
			password: '',
			confirm_password: '',
		},
	});

	const joinForm = useForm<JoinFormValues>({
		resolver: zodResolver(joinFormSchema),
		defaultValues: {},
	});

	// Use the appropriate form based on type
	const form = isRookie ? rookieForm : joinForm;

	const onSubmit = async (values: RookieFormValues | JoinFormValues) => {
		let userData = null;

		if (isRookie) {
			const rookieValues = values as RookieFormValues;
			userData = {
				full_name: rookieValues.full_name,
				password: rookieValues.password,
			};
		}

		try {
			// Call joinWorkspace mutation with workspaceId, token, email, and user data
			await joinWorkspace.mutateAsync({
				workspaceId,
				data: {
					token,
					email,
					user_data: userData,
				},
			});

			// On success, update state and navigate to success page
			setIsRedirecting(true);
			setIsWorkspaceJoinSuccess(true);
			navigate.push(`/workspace/${workspaceId}/${type}/success`);

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			// Extract error message safely and show toast notification
			const errorMsg = error?.response?.data?.message || 'Workspace join failed. Please try again.';
			toast.error(errorMsg);
		}
	};

	const isSubmitting = form.formState.isSubmitting || joinWorkspace.status === 'pending' || isRedirecting;
	return (
		<div className='w-full max-w-sm'>
			<Card>
				<CardHeader>
					<CardTitle className='text-2xl'>Welcome to join {workspaceName || 'workspace'}</CardTitle>
					{isRookie && <CardDescription>Enter your name and password below to join</CardDescription>}
				</CardHeader>
				<CardContent>
					<Form {...rookieForm}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
							{isRookie && (
								<>
									<FormField
										control={rookieForm.control}
										name='email'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input placeholder='Your email...' {...field} disabled />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={rookieForm.control}
										name='full_name'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Name</FormLabel>
												<FormControl>
													<Input placeholder='Your name...' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={rookieForm.control}
										name='password'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Password</FormLabel>
												<FormControl>
													<Input placeholder='Your password...' type='password' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={rookieForm.control}
										name='confirm_password'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Confirm Password</FormLabel>
												<FormControl>
													<Input placeholder='Confirm password...' type='password' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</>
							)}
							<Button type='submit' className='w-full' disabled={isSubmitting}>
								{isSubmitting ? <Loading size='sm' /> : 'Join'}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};

export default JoinWorkspaceForm;
