'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Loading from '@/components/svg/Loading';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import useAuthStore from '@/features/auth/stores/useAuthStore';
import { useSignup } from '@/features/auth/hooks/useAuthApiHooks';

const formSchema = z
	.object({
		email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
		full_name: z.string().min(1, { message: 'Name is required' }),
		password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
		confirm_password: z.string().min(1, { message: 'Confirm password is required' }),
	})
	.refine((data) => data.password === data.confirm_password, {
		path: ['confirm_password'],
		message: 'Passwords do not match',
	});

type FormValues = z.infer<typeof formSchema>;

const SignupForm = ({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) => {
	const signup = useSignup();
	const setIsSignupSuccess = useAuthStore((state) => state.setIsSignupSuccess);
	const router = useRouter();
	const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
	const [isRedirecting, setIsRedirecting] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			full_name: '',
			password: '',
			confirm_password: '',
		},
	});

	const isSubmitting = form.formState.isSubmitting || signup.status === 'pending' || isRedirecting;

	const onSubmit = async (values: FormValues) => {
		setServerErrors({});

		try {
			await signup.mutateAsync({
				email: values.email,
				full_name: values.full_name,
				password: values.password,
			});

			setIsSignupSuccess(true);
			setIsRedirecting(true);
			router.push('/signup/success');

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			const errMsg = JSON.parse(err.message);

			if (errMsg && Array.isArray(errMsg)) {
				const newErrors = Object.assign({}, ...errMsg);
				setServerErrors(newErrors);

				// Apply field-level validation errors to the form
				Object.entries(newErrors).forEach(([field, message]) => {
					if (typeof message === 'string') {
						form.setError(field as keyof FormValues, {
							type: 'server',
							message: message,
						});
					}
				});
			} else {
				setServerErrors({ general: errMsg || 'Signup failed. Please try again.' });
			}
		}
	};

	return (
		<div className={cn('flex min-h-screen flex-col items-center justify-center p-4', className)} {...props}>
			{/* Slack-style Header */}
			<div className='mb-8 text-center'>
				<div className='bg-primary mb-6 inline-flex h-16 w-16 items-center justify-center rounded-lg'>
					<Image src='/icon1.png' alt='Slack Logo' width={32} height={32} />
				</div>
				<h1 className='mb-2 text-3xl font-bold text-gray-900'>Create your Slack Clone account</h1>
				<p className='text-gray-600'>Use your work email to get started with your team.</p>
			</div>

			<Card className='w-full max-w-md border-0 shadow-lg'>
				<CardContent className='pt-6'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-sm font-medium text-gray-700'>Email</FormLabel>
										<FormControl>
											<Input
												placeholder='you@company.com'
												type='email'
												autoComplete='email'
												disabled={isSubmitting}
												{...field}
												className='h-11 rounded-md border-gray-300 focus:border-[#4A154B] focus:ring-[#4A154B]'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='full_name'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-sm font-medium text-gray-700'>Name</FormLabel>
										<FormControl>
											<Input
												placeholder='Your name'
												autoComplete='name'
												disabled={isSubmitting}
												{...field}
												className='h-11 rounded-md border-gray-300 focus:border-[#4A154B] focus:ring-[#4A154B]'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-sm font-medium text-gray-700'>Password</FormLabel>
										<FormControl>
											<Input
												placeholder='Enter your password'
												type='password'
												autoComplete='new-password'
												disabled={isSubmitting}
												{...field}
												className='h-11 rounded-md border-gray-300 focus:border-[#4A154B] focus:ring-[#4A154B]'
											/>
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
										<FormLabel className='text-sm font-medium text-gray-700'>Confirm Password</FormLabel>
										<FormControl>
											<Input
												placeholder='Re-enter your password'
												type='password'
												autoComplete='new-password'
												disabled={isSubmitting}
												{...field}
												className='h-11 rounded-md border-gray-300 focus:border-[#4A154B] focus:ring-[#4A154B]'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{serverErrors.general && (
								<div className='rounded-md border border-red-200 bg-red-50 p-3'>
									<div className='text-sm text-red-800'>{serverErrors.general}</div>
								</div>
							)}

							<Button
								type='submit'
								className='bg-primary h-11 w-full rounded-md font-medium text-white transition-colors hover:bg-[#3d1142]'
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									<>
										<Loading size='sm' />
										<span className='ml-2'>Creating Account...</span>
									</>
								) : (
									'Create Account'
								)}
							</Button>

							<div className='text-center text-sm text-gray-600'>
								Already have an account?{' '}
								<Link href='/signin' className='font-medium text-[#1264a3] hover:underline'>
									Sign In
								</Link>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>

			{/* Footer */}
			<div className='mt-8 space-y-4 text-center'>
				<div className='flex items-center justify-center space-x-6 text-xs text-gray-500'>
					<Link href='/privacy' className='hover:underline'>
						Privacy
					</Link>
					<Link href='/terms' className='hover:underline'>
						Terms
					</Link>
					<Link href='/help' className='hover:underline'>
						Help
					</Link>
				</div>
			</div>
		</div>
	);
};

export default SignupForm;
