'use client';

import React, { useEffect, useState } from 'react';

import { Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { ChannelRead } from '@/types/channel';
import ChannelAbout from '@/features/channel/components/ChannelAbout';
import useChannelStore from '@/features/channel/stores/useChannelStore';
import ChannelSettings from '@/features/channel/components/ChannelSettings';
import ChannelMemberSearch from '@/features/channel/components/ChannelMemberSearch';
import { WorkspaceRead } from '@/types/workspace';

const ChannelUpdateDialog = ({ workspace, channel }: { workspace?: WorkspaceRead; channel?: ChannelRead }) => {
	const { openUpdateChannelDialog, setOpenUpdateChannelDialog, updateChannelTab } = useChannelStore();

	const [tabs, setTabs] = useState([
		{
			name: 'About',
			value: 'about',
			count: 0,
		},
		{
			name: 'Members',
			value: 'members',
			count: channel?.members?.length,
		},
	]);

	useEffect(() => {
		if (channel?.membership?.role === 'owner' || channel?.membership?.role === 'admin') {
			setTabs([
				{
					name: 'About',
					value: 'about',
					count: 0,
				},
				{
					name: 'Members',
					value: 'members',
					count: channel?.members?.length,
				},
				{
					name: 'Settings',
					value: 'settings',
					count: 0,
				},
			]);
		}
	}, [channel]);

	return (
		<Dialog open={openUpdateChannelDialog} onOpenChange={setOpenUpdateChannelDialog}>
			<DialogContent className='flex flex-col gap-1 p-0'>
				<DialogHeader className='px-6 pt-6'>
					<DialogTitle># {channel?.name}</DialogTitle>
					<DialogDescription>
						<Button variant='outline' size='icon'>
							<Star fill={channel?.membership?.is_starred ? 'var(--color-primary)' : 'none'} />
						</Button>
					</DialogDescription>
				</DialogHeader>
				<Tabs defaultValue={updateChannelTab} className='flex h-full w-full flex-col gap-0 border-none!'>
					<TabsList className='bg-background h-10 w-full justify-start gap-1 rounded-none border-b px-4 py-0'>
						{tabs.map((tab) => (
							<TabsTrigger
								key={tab.name}
								value={tab.value}
								className='data-[state=active]:border-b-primary data-[state=active]:bg-background h-full flex-0 rounded-none border-b-2 border-transparent data-[state=active]:shadow-none'
							>
								<span className='text-sm font-semibold'>{tab.name}</span>
								{!!tab.count && tab.count}
							</TabsTrigger>
						))}
					</TabsList>
					<TabsContent value='about' className='bg-secondary min-h-[500px] rounded-b-lg! p-5'>
						<ChannelAbout channel={channel} />
					</TabsContent>
					<TabsContent value='members' className='min-h-[500px] py-5'>
						<ChannelMemberSearch workspace={workspace} channel={channel} />
					</TabsContent>
					<TabsContent value='settings' className='min-h-[500px] p-5'>
						<ChannelSettings channel={channel} onSuccess={() => setOpenUpdateChannelDialog(false)} />
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
};

export default ChannelUpdateDialog;
