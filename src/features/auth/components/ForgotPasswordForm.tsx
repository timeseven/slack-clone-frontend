'use client';

import type React from 'react';

import { useState } from 'react';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import Loading from '@/components/svg/Loading';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { cn } from '@/lib/utils';
import useAuthStore from '@/features/auth/stores/useAuthStore';
import { useForgotPassword } from '@/features/auth/hooks/useAuthApiHooks';

const formSchema = z.object({
	email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
});

type FormValues = z.infer<typeof formSchema>;

const ForgotPasswordForm = ({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) => {
	const forgotPassword = useForgotPassword();
	const setIsForgotPasswordSuccess = useAuthStore((state) => state.setIsForgotPasswordSuccess);
	const navigate = useRouter();
	const [isRedirecting, setIsRedirecting] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
		},
	});

	const onSubmit = async (values: FormValues) => {
		try {
			// Call the forgot password mutation
			await forgotPassword.mutateAsync(values);

			// If successful, update local state and navigate to success page
			setIsForgotPasswordSuccess(true);
			setIsRedirecting(true);
			navigate.push('/forgot-password/success');
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			// Handle server error response
			const errMsg = JSON.parse(err.message);

			if (errMsg && Array.isArray(errMsg)) {
				const newErrors = Object.assign({}, ...errMsg);

				// Set server-side field errors in the form
				Object.entries(newErrors).forEach(([field, message]) => {
					if (typeof message === 'string') {
						form.setError(field as keyof FormValues, {
							type: 'server',
							message: message,
						});
					}
				});
			}
		}
	};

	const isSubmitting = form.formState.isSubmitting || forgotPassword.status === 'pending' || isRedirecting;

	return (
		<div className={cn(className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle className='text-2xl'>Forgot Password</CardTitle>
					<CardDescription>Enter your email to reset your password</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input placeholder='m@example.com' type='email' disabled={isSubmitting} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type='submit' className='w-full' disabled={isSubmitting}>
								{isSubmitting ? <Loading size='sm' /> : 'Get Recovery Email'}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};

export default ForgotPasswordForm;
