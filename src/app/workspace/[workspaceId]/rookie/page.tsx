import JoinWorkspaceForm from '@/features/workspace/components/JoinWorkspaceForm';
import React from 'react';

const RookiePage = () => {
	return (
		<div className='bg-background fixed inset-0 flex h-full items-center justify-center p-2'>
			<JoinWorkspaceForm type='rookie' />
		</div>
	);
};

export default RookiePage;
