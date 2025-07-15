import Image from 'next/image';

const WorkspaceIdPage = () => {
	return (
		<div className='flex h-full w-full flex-col items-center justify-center gap-10 p-5'>
			<Image src='/images/undraw_select_option.svg' alt='Page not found illustration' width={400} height={400} />
			<span className='text-sm font-bold md:text-xl'>Create or select a channel to get started</span>
		</div>
	);
};

export default WorkspaceIdPage;
