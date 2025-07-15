import { Skeleton } from '@/components/ui/skeleton';

const LeftSecondarySidebarContentSkeleton = () => {
	return (
		<div className='space-y-3 p-3'>
			<Skeleton className='h-6 w-full' />
			<Skeleton className='h-6 w-full' />
			<Skeleton className='h-6 w-full' />
			<Skeleton className='h-6 w-full' />
			<Skeleton className='h-6 w-full' />
			<Skeleton className='h-6 w-full' />
			<Skeleton className='h-6 w-full' />
		</div>
	);
};

export default LeftSecondarySidebarContentSkeleton;
