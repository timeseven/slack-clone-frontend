'use client';

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

const DMSList = () => {
	const messages = [
		{
			key: 1,
			title: 'Direct messages',
			lastMessage: 'Last message',
		},
		{
			key: 2,
			title: 'Direct messages',
			lastMessage: 'Last message',
		},
		{
			key: 3,
			title: 'Direct messages',
			lastMessage: 'Last message',
		},
		{
			key: 4,
			title: 'Direct messages',
			lastMessage: 'Last message',
		},
		{
			key: 5,
			title: 'Direct messages',
			lastMessage: 'Last message',
		},
		{
			key: 6,
			title: 'Direct messages',
			lastMessage: 'Last message',
		},
		{
			key: 7,
			title: 'Direct messages',
			lastMessage: 'Last message',
		},
		{
			key: 8,
			title: 'Direct messages8',
			lastMessage: 'Last message',
		},
		{
			key: 9,
			title: 'Direct messages9',
			lastMessage: 'Last message',
		},
	];
	return (
		<ScrollArea className='h-full overflow-y-auto py-3'>
			{messages.map((message) => {
				return (
					<div key={message.key} className='flex h-20 cursor-pointer items-center gap-x-2 px-4 py-2 hover:bg-blue-200'>
						<div>{message.title}</div>
						<div className='flex flex-1 flex-col'>
							<div className='flex items-center justify-between'>
								<div>{message.title}</div>
								<div>time</div>
							</div>
							<div>{message.lastMessage}</div>
						</div>
					</div>
				);
			})}
		</ScrollArea>
	);
};

export default DMSList;
