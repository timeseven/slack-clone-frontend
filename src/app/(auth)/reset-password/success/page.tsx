'use client';

import { useEffect } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import useAuthStore from '@/features/auth/stores/useAuthStore';

const ResetPasswordSuccess = () => {
	const navigate = useRouter();
	const isResetPasswordSuccess = useAuthStore((state) => state.isResetPasswordSuccess);

	useEffect(() => {
		if (!isResetPasswordSuccess) {
			navigate.push('/reset-password');
		}
	}, [isResetPasswordSuccess, navigate]);

	if (!isResetPasswordSuccess) {
		return null;
	}

	return (
		<div className='bg-background flex min-h-screen flex-col items-center justify-center px-4 text-center'>
			<div className='w-full max-w-md space-y-6'>
				<Image
					src='/images/undraw_confirmation.svg'
					alt='Page not found illustration'
					width={200}
					height={100}
					className='mx-auto'
				/>
				<h1 className='text-success text-3xl font-bold tracking-tight'>Reset Password Success</h1>
				<Link href='/signin'>
					<Button variant='default'>Go to sign in</Button>
				</Link>
			</div>
		</div>
	);
};

export default ResetPasswordSuccess;
