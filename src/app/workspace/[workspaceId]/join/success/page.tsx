'use client';

import { useEffect } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import useAuthStore from '@/features/auth/stores/useAuthStore';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
const WorkspaceJoinSuccess = () => {
	const navigate = useRouter();
	const isWorkspaceJoinSuccess = useAuthStore((state) => state.isWorkspaceJoinSuccess);

	useEffect(() => {
		if (!isWorkspaceJoinSuccess) {
			navigate.push('/signin');
		}
	}, [isWorkspaceJoinSuccess, navigate]);

	if (!isWorkspaceJoinSuccess) {
		return null;
	}

	return (
		<div className='bg-background fixed inset-0 flex min-h-screen flex-col items-center justify-center px-4 text-center'>
			<div className='w-full max-w-md space-y-6'>
				<Image
					src='/images/undraw_done.svg'
					alt='Page not found illustration'
					width={200}
					height={100}
					className='mx-auto'
				/>
				<h1 className='text-success text-3xl font-bold tracking-tight'>Join Workspace Success</h1>
				<Link href='/signin'>
					<Button variant='default'>Go to sign in</Button>
				</Link>
			</div>
		</div>
	);
};

export default WorkspaceJoinSuccess;
