import React, { useState } from 'react';

import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';

import { ApiResponse } from '@/types/global';
import { cn, createDelta } from '@/lib/utils';
import { ChannelRead } from '@/types/channel';
import { queryClient } from '@/context/ReactQueryContext';

import ChannelUpdateDescriptionDialog from '@/features/channel/components/ChannelUpdateDescriptionDialog';
import useChannelStore from '@/features/channel/stores/useChannelStore';
import { useLeaveChannel } from '@/features/channel/hooks/useChannelApiHooks';
import { useCreateMessage } from '@/features/message/hooks/useMessageApiHooks';

const ChannelAbout = ({ channel }: { channel?: ChannelRead }) => {
	const leaveChannel = useLeaveChannel();
	const createMessage = useCreateMessage();

	const { setOpenUpdateChannelDialog } = useChannelStore();

	const [openEditDescriptionDialog, setOpenEditDescriptionDialog] = useState(false);

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

			setOpenUpdateChannelDialog(false);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<>
			<Card className='rounded-lg p-0'>
				<CardContent className='p-0'>
					<div
						className={cn('hover:bg-secondary flex h-20 flex-col justify-center rounded-t-lg p-4', {
							'cursor-pointer': channel?.membership?.role === 'owner' || channel?.membership?.role === 'admin',
						})}
						onClick={() => {
							if (channel?.membership?.role === 'owner' || channel?.membership?.role === 'admin') {
								setOpenEditDescriptionDialog(true);
							}
						}}
					>
						<div className='flex items-center justify-between'>
							<span className='font-semibold'>Description</span>
							{(channel?.membership?.role === 'owner' || channel?.membership?.role === 'admin') && (
								<Button
									variant='link'
									size='sm'
									onClick={(e) => {
										e.stopPropagation();
										setOpenEditDescriptionDialog(true);
									}}
								>
									Edit
								</Button>
							)}
						</div>
						<div className='grow text-sm text-gray-400'>{channel?.description || 'Add a description'}</div>
					</div>
					<Separator />
					<div className='hover:bg-secondary flex h-20 flex-col p-4'>
						<div className='font-semibold'>Created by</div>
						<div className='grow text-sm text-gray-400'>
							{channel?.members?.find((member) => member.role === 'owner')?.full_name} on{' '}
							{format(new Date(channel!.created_at), 'd MMMM yyyy')}
						</div>
					</div>
					<Separator />
					<div
						className={cn('hover:bg-secondary flex h-14 cursor-pointer flex-col justify-center rounded-b-lg p-4', {
							'cursor-not-allowed opacity-50 hover:bg-transparent!': channel?.membership?.role === 'owner',
						})}
						onClick={() => {
							if (channel?.membership?.role === 'owner') return;
							handleLeaveChannel();
						}}
					>
						<div className='text-destructive font-semibold'>
							Leave channel{' '}
							{!!(channel?.membership?.role === 'owner') && (
								<span className='text-sm text-gray-400'>(Transfer ownership before leaving)</span>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
			<ChannelUpdateDescriptionDialog
				open={openEditDescriptionDialog}
				onOpenChange={setOpenEditDescriptionDialog}
				channel={channel}
			/>
		</>
	);
};

export default ChannelAbout;
