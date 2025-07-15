'use client';

import React from 'react';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';

import { Input } from '@/components/ui/input';
import Loading from '@/components/svg/Loading';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { cn } from '@/lib/utils';
import useAuthStore from '@/features/auth/stores/useAuthStore';
import { useResetPassword } from '@/features/auth/hooks/useAuthApiHooks';

const formSchema = z
	.object({
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

type FormValues = z.infer<typeof formSchema>;

const ResetPasswordForm = ({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) => {
	const resetPassword = useResetPassword();
	const setIsResetPasswordSuccess = useAuthStore((state) => state.setIsResetPasswordSuccess);
	const navigate = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get('token');
	const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
	const [isRedirecting, setIsRedirecting] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			password: '',
			confirm_password: '',
		},
	});

	const onSubmit = async (values: FormValues) => {
		// Clear any previous server errors
		setServerErrors({});

		try {
			// Call the reset password mutation
			await resetPassword.mutateAsync({
				password: values.password,
				token: token || '',
			});

			// If successful, update local state and redirect to success page
			setIsResetPasswordSuccess(true);
			setIsRedirecting(true);
			navigate.push('/reset-password/success');
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			// Extract error message
			const errMsg = JSON.parse(err.message);

			if (errMsg && Array.isArray(errMsg)) {
				const newErrors = Object.assign({}, ...errMsg);

				// Set server error state
				setServerErrors(newErrors);

				// Set individual field errors in the form
				Object.entries(newErrors).forEach(([field, message]) => {
					if (typeof message === 'string') {
						form.setError(field as keyof FormValues, {
							type: 'server',
							message: message,
						});
					}
				});
			} else {
				// Handle general server-side error
				setServerErrors({
					general: errMsg || 'Bad or expired token.',
				});
			}
		}
	};

	const isSubmitting = form.formState.isSubmitting || resetPassword.status === 'pending' || isRedirecting;

	return (
		<div className={cn(className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle className='text-2xl'>Reset Password</CardTitle>
					<CardDescription>Enter your new password below</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormLabel>New Password</FormLabel>
										<FormControl>
											<Input placeholder='Your password...' type='password' disabled={isSubmitting} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='confirm_password'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm Password</FormLabel>
										<FormControl>
											<Input placeholder='Confirm password...' type='password' disabled={isSubmitting} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{serverErrors.general && <div className='text-destructive text-sm'>{serverErrors.general}</div>}
							<Button type='submit' className='w-full' disabled={isSubmitting}>
								{isSubmitting ? <Loading size='sm' /> : 'Reset Password'}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};

export default ResetPasswordForm;
