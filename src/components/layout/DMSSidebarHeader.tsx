import React from 'react';
import MessageFilterButton from '@/features/message/components/MessageFilterButton';
import UnreadsSwitch from '@/components/global/UnreadsSwitch';
import ButtonHint from '@/components/global/ButtonHint';
import { SquarePen } from 'lucide-react';

const DMSSidebarHeader = () => {
	return (
		<div className='flex w-full items-center justify-between'>
			<div className='min-w-0 flex-1'>
				<MessageFilterButton />
			</div>
			<div className='flex min-w-0 flex-1 items-center justify-end gap-x-2'>
				<UnreadsSwitch />
				<ButtonHint icon={SquarePen} hint='New Message' lucideClassName='text-muted group-hover:text-primary' />
			</div>
		</div>
	);
};

export default DMSSidebarHeader;
