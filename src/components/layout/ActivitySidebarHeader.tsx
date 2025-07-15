import React from 'react';
import UnreadsSwitch from '@/components/global/UnreadsSwitch';

const ActivitySidebarHeader = () => {
	return (
		<div className='flex w-full items-center justify-between'>
			<span className='px-3 py-2 text-xl font-bold text-white'>Activity</span>
			<div className='flex flex-1 items-center justify-end gap-x-1'>
				<UnreadsSwitch />
			</div>
		</div>
	);
};

export default ActivitySidebarHeader;
