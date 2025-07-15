'use client';

import React, { useMemo } from 'react';

import { EllipsisVertical } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ChannelRead } from '@/types/channel';
import { UserRead } from '@/types/user';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useChannelStore from '@/features/channel/stores/useChannelStore';
import Hint from '@/components/global/Hint';
import AvatarGroup from '@/components/global/AvatarGroup';
import AvatarContainer from '@/components/global/AvatarContainer';

import { createDelta } from '@/lib/utils';
import { queryClient } from '@/context/ReactQueryContext';
import { ApiResponse } from '@/types/global';
import { useLeaveChannel } from '@/features/channel/hooks/useChannelApiHooks';
import { useCreateMessage } from '@/features/message/hooks/useMessageApiHooks';

const ChannelHeader = ({ channel, user }: { channel?: ChannelRead; user: UserRead }) => {
	const { setOpenUpdateChannelDialog, setUpdateChannelTab } = useChannelStore();
	const leaveChannel = useLeaveChannel();
	const createMessage = useCreateMessage();
	const channelName = useMemo(() => {
		if (channel?.type === 'channel') {
			return `#${channel.name}`;
		} else {
			if (channel?.members?.length === 1) {
				return `@${channel?.members[0].full_name}`;
			} else {
				const name: string[] = [];
				channel?.members?.forEach((member) => {
					if (member.id !== user?.id) {
						name.push(member.full_name);
					}
				});
				return `@${name.join(', ')}`;
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [channel]);

	const handleLeaveChannel = async () => {
		try {
			await createMessage.mutateAsync({
				workspaceId: channel?.workspace_id || '',
				channelId: channel?.id || '',
				data: {
					content: createDelta(`left #${channel?.name}`),
					parent_id: null,
					message_type: 'message_system',
				},
			});

			await leaveChannel.mutateAsync({
				workspaceId: channel?.workspace_id || '',
				channelId: channel?.id || '',
			});

			queryClient.setQueryData(['channels', channel?.workspace_id], (prev: ApiResponse<ChannelRead[]> | undefined) => {
				if (!prev) return prev;
				return {
					...prev,
					data: prev.data.filter((c) => c.id !== channel?.id),
				};
			});
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='flex h-10 items-center justify-between px-4'>
			<div className='flex w-full items-center gap-3'>
				<Hint label={channelName} side='bottom' align='center'>
					<div className='inline-block max-w-[30%] truncate font-bold'>{channelName}</div>
				</Hint>
				<Hint label={`Description: ${channel?.description}`} side='bottom' align='center'>
					<div className='max-w-[70%] truncate text-sm'>{channel?.description}</div>
				</Hint>
			</div>
			<div className='flex items-center justify-between gap-x-4'>
				{(channel?.type === 'channel' || channel?.type === 'group_dm') && (
					<Button
						variant='ghost'
						className='p-0'
						disabled={!channel?.membership}
						onClick={() => {
							setOpenUpdateChannelDialog(true);
							setUpdateChannelTab('members');
						}}
					>
						<Hint label='View all members' side='bottom' align='center'>
							<AvatarGroup className='flex items-center' max={3}>
								{channel?.members?.map((member) => (
									<AvatarContainer
										key={member.id}
										src={member?.avatar}
										alt={member?.full_name}
										name={member?.full_name}
										containerProps={{
											className: '-ml-2 cursor-pointer transition-transform first:ml-0 hover:scale-105',
										}}
									/>
								))}
							</AvatarGroup>
						</Hint>
					</Button>
				)}

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' size='icon' disabled={!channel?.membership}>
							<EllipsisVertical />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className='w-56' align='start'>
						<DropdownMenuGroup>
							<DropdownMenuItem
								className='cursor-pointer'
								onClick={() => {
									console.log('open channel details');
									setOpenUpdateChannelDialog(true);
									setUpdateChannelTab('about');
								}}
							>
								Open channel details
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem
								className='cursor-pointer'
								onClick={() => {
									console.log('star channel');
								}}
							>
								Star channel
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							{channel?.membership?.role === 'owner' && (
								<DropdownMenuItem
									className='cursor-pointer'
									onClick={() => {
										console.log('edit settings');
										setOpenUpdateChannelDialog(true);
										setUpdateChannelTab('settings');
									}}
								>
									Edit settings
								</DropdownMenuItem>
							)}
							<DropdownMenuSub>
								<DropdownMenuSubTrigger className='cursor-pointer'>Copy</DropdownMenuSubTrigger>
								<DropdownMenuPortal>
									<DropdownMenuSubContent>
										<DropdownMenuItem
											className='cursor-pointer'
											onClick={() => {
												console.log('copy channel name');
											}}
										>
											Copy name
										</DropdownMenuItem>
									</DropdownMenuSubContent>
								</DropdownMenuPortal>
							</DropdownMenuSub>
						</DropdownMenuGroup>
						{channel?.membership?.role !== 'owner' && channel?.type !== 'dm' && (
							<>
								<DropdownMenuSeparator />
								<DropdownMenuItem className='text-destructive cursor-pointer' onClick={handleLeaveChannel}>
									Leave channel
								</DropdownMenuItem>
							</>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
};

export default ChannelHeader;
