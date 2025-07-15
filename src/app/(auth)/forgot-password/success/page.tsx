'use client';

import { useEffect } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import useAuthStore from '@/features/auth/stores/useAuthStore';

const ForgotPasswordSuccess = () => {
	const navigate = useRouter();
	const isForgotPasswordSuccess = useAuthStore((state) => state.isForgotPasswordSuccess);

	useEffect(() => {
		if (!isForgotPasswordSuccess) {
			navigate.push('/forgot-password');
		}
	}, [isForgotPasswordSuccess, navigate]);

	if (!isForgotPasswordSuccess) {
		return null;
	}

	return (
		<div className='bg-background flex min-h-screen flex-col items-center justify-center px-4 text-center'>
			<div className='w-full max-w-md space-y-6'>
				<Image
					src='/images/undraw_mail_sent.svg'
					alt='Page not found illustration'
					width={200}
					height={100}
					className='mx-auto'
				/>
				<h1 className='text-3xl font-bold tracking-tight'>Recovery Email Sent Success</h1>
				<p className='text-muted-foreground'>A recovery email has been sent to your email. Please check your inbox</p>
			</div>
		</div>
	);
};

export default ForgotPasswordSuccess;
