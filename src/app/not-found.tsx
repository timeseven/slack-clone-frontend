'use client';

// app/not-found.tsx
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import useRouteStore from '@/stores/useRouteStore';
import { useRouter } from 'next/navigation';

export default function NotFoundPage() {
	const navigate = useRouter();
	const resetRoute = useRouteStore((state) => state.resetRoute);

	return (
		<div className='bg-background flex min-h-screen flex-col items-center justify-center px-4 text-center'>
			<div className='w-full max-w-md space-y-6'>
				<Image
					src='/images/undraw_page_not_found.svg'
					alt='Page not found illustration'
					width={400}
					height={300}
					className='mx-auto'
				/>
				<h1 className='text-3xl font-bold tracking-tight'>Page Not Found</h1>
				<p className='text-muted-foreground'>Sorry, we couldn&apos;t find the page you were looking for.</p>

				<Button
					variant='default'
					onClick={() => {
						resetRoute();
						navigate.push('/workspace');
					}}
				>
					Go Back Home
				</Button>
			</div>
		</div>
	);
}
