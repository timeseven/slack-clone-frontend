import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { verifyEmail } from '@/features/auth/services/authApi';
import { VerifyEmailProps } from '@/types/auth';

const VerifyEmailPage = async ({ searchParams }: { searchParams: VerifyEmailProps }) => {
	// Await searchParams
	const { token } = await searchParams;

	// If token is missing, return an error message early
	if (!token) {
		return (
			<div className='bg-background flex min-h-screen flex-col items-center justify-center px-4 text-center'>
				<div className='w-full max-w-md space-y-6'>
					<Image
						src='/images/undraw_cancel.svg'
						alt='Page not found illustration'
						width={200}
						height={100}
						className='mx-auto'
					/>
					<h1 className='text-destructive text-3xl font-bold tracking-tight'>Invalid token</h1>
					<Button variant='default'>Resend the verification</Button>
				</div>
			</div>
		);
	}

	try {
		const response = await verifyEmail({ token });

		if (response.code === 200) {
			return (
				<div className='bg-background flex min-h-screen flex-col items-center justify-center px-4 text-center'>
					<div className='w-full max-w-md space-y-6'>
						<Image
							src='/images/undraw_authentication.svg'
							alt='Page not found illustration'
							width={200}
							height={100}
							className='mx-auto'
						/>
						<h1 className='text-success text-3xl font-bold tracking-tight'>Account Verified</h1>
						<Link href='/signin'>
							<Button variant='default'>Go to sign in</Button>
						</Link>
					</div>
				</div>
			);
		} else {
			return (
				<div className='bg-background flex min-h-screen flex-col items-center justify-center px-4 text-center'>
					<div className='w-full max-w-md space-y-6'>
						<Image
							src='/images/undraw_cancel.svg'
							alt='Page not found illustration'
							width={200}
							height={100}
							className='mx-auto'
						/>
						<h1 className='text-destructive text-3xl font-bold tracking-tight'>Failed to verify account</h1>
						<Button variant='default'>Resend the verification</Button>
					</div>
				</div>
			);
		}
	} catch (error) {
		return (
			<div className='bg-background flex min-h-screen flex-col items-center justify-center px-4 text-center'>
				<div className='w-full max-w-md space-y-6'>
					<Image
						src='/images/undraw_cancel.svg'
						alt='Page not found illustration'
						width={200}
						height={100}
						className='mx-auto'
					/>
					<h1 className='text-destructive text-3xl font-bold tracking-tight'>Something went wrong</h1>
					<span className='sr-only'>{`${error}`}</span>
					<Link href='/signup'>
						<Button variant='default'>Sign up again</Button>
					</Link>
				</div>
			</div>
		);
	}
};

export default VerifyEmailPage;
