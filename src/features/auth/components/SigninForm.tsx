'use client';

import type React from 'react';
import { useState } from 'react';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import type { MenuKey } from '@/types/layout';
import useRouteStore from '@/stores/useRouteStore';
import useWorkspaceStore from '@/features/workspace/stores/useWorkspaceStore';
import { useSignin } from '@/features/auth/hooks/useAuthApiHooks';
import Image from 'next/image';

const formSchema = z.object({
	email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
	password: z
		.string()
		.min(1, { message: 'Password is required' })
		.min(8, { message: 'Password must be at least 8 characters' }),
});

type FormValues = z.infer<typeof formSchema>;

const SigninForm = ({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) => {
	const searchParams = useSearchParams();
	const redirect = searchParams.get('redirect');
	const signin = useSignin();
	const navigate = useRouter();
	const { resetRoute, setRouteMap, setCurrentMenu } = useRouteStore();
	const { resetWorkspace } = useWorkspaceStore();
	const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
	const [isRedirecting, setIsRedirecting] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = async (values: FormValues) => {
		// Clear any previous server-side errors
		setServerErrors({});
		resetRoute();
		resetWorkspace();

		try {
			// Perform signin mutation
			await signin.mutateAsync(values);

			// After successful signin, begin redirecting
			setIsRedirecting(true);

			// Determine redirect path or default to workspace home
			const path = redirect || '';

			// Map keywords in path to menu keys
			const pathToMenu: Record<string, MenuKey> = {
				dms: 'DMs',
				activity: 'Activity',
			};

			// Try to match the path to a menu item
			const matchedMenu = Object.entries(pathToMenu).find(([key]) => path.includes(key));
			const menu = matchedMenu?.[1] || 'Home';

			// Update UI state
			setCurrentMenu(menu);
			setRouteMap(menu, path);

			// Navigate to the target route
			navigate.push(path || '/workspace');
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
				setServerErrors({
					general: errMsg || 'Signin failed. Please try again.',
				});
			}
		}
	};

	const isSubmitting = form.formState.isSubmitting || signin.status === 'pending' || isRedirecting;

	return (
		<div className={cn('flex min-h-screen flex-col items-center justify-center p-4', className)} {...props}>
			{/* Slack Logo and Header */}
			<div className='mb-8 text-center'>
				<div className='bg-primary mb-6 inline-flex h-16 w-16 items-center justify-center rounded-lg'>
					<Image src='/icon1.png' alt='Slack Logo' width={32} height={32} />
				</div>
				<h1 className='mb-2 text-3xl font-bold text-gray-900'>Sign in to Slack Clone</h1>
				<p className='text-gray-600'>
					We suggest using the <strong>email address you use at work.</strong>
				</p>
			</div>

			<Card className='w-full border-0 shadow-lg'>
				<CardContent className='pt-0'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-sm font-medium text-gray-700'>Email address</FormLabel>
										<FormControl>
											<Input
												placeholder='name@work-email.com'
												type='email'
												disabled={isSubmitting}
												{...field}
												autoComplete='email'
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
												disabled={isSubmitting}
												{...field}
												autoComplete='current-password'
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
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
										Signing in...
									</>
								) : (
									'Sign In with Email'
								)}
							</Button>

							<div className='text-center'>
								<Link href='/forgot-password' className='text-sm font-medium text-[#1264a3] hover:underline'>
									Forgot your password?
								</Link>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>

			{/* Footer */}
			<div className='mt-8 space-y-4 text-center'>
				<div className='text-sm text-gray-600'>
					New to Slack?{' '}
					<Link href='/signup' className='font-medium text-[#1264a3] hover:underline'>
						Create an account
					</Link>
				</div>

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

export default SigninForm;
