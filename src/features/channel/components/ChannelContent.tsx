'use client';

import { useEffect, useState } from 'react';

import { toast } from 'sonner';
import { MessageCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import MessageList from '@/features/message/components/MessageList';
import MessageInput from '@/features/message/components/MessageInput';

import { queryClient } from '@/context/ReactQueryContext';
import { ChannelRead, ChannelTabProps } from '@/types/channel';
import { handleClearMessageUnread } from '@/features/message/sockets/handleMessage';
import { createDelta } from '@/lib/utils';
import { useClearUnreadCount, useJoinChannel, useUpdateLastRead } from '@/features/channel/hooks/useChannelApiHooks';
import { useBidirectionalMessages, useCreateMessage } from '@/features/message/hooks/useMessageApiHooks';
import { WorkspaceRead } from '@/types/workspace';

const ChannelContent = ({ workspace, channel }: { workspace?: WorkspaceRead; channel?: ChannelRead }) => {
	const [tabs, setTabs] = useState<ChannelTabProps[]>([]);

	const joinChannel = useJoinChannel();
	const updateLastRead = useUpdateLastRead();
	const clearUnreadCount = useClearUnreadCount();
	const createMessage = useCreateMessage();

	const {
		messages,
		fetchMoreOlder,
		fetchMoreNewer,
		isFetchingOlder,
		isFetchingNewer,
		hasMoreOlder,
		hasMoreNewer,
		isLoading,
	} = useBidirectionalMessages({ workspaceId: workspace?.id || '', channelId: channel?.id || '' });

	const handleJoinChannel = async () => {
		if (channel?.is_private) {
			toast.error('This channel is private. You need to be invited to join.');
			return;
		}
		try {
			// Call the mutation to join the channel
			await joinChannel.mutateAsync({
				workspaceId: workspace?.id || '',
				channelId: channel?.id || '',
			});

			queryClient.invalidateQueries({ queryKey: ['channels', workspace?.id] });

			await createMessage.mutateAsync({
				workspaceId: workspace?.id || '',
				channelId: channel?.id || '',
				data: {
					content: createDelta(`joined #${channel?.name}`),
					parent_id: null,
					message_type: 'message_system',
				},
			});
		} catch (error) {
			console.error('Join channel failed:', error);
		}
	};

	const handleClearUnreadCount = async () => {
		try {
			// Call the mutation to clear unread count
			await clearUnreadCount.mutateAsync({
				workspaceId: workspace?.id || '',
				channelId: channel?.id || '',
			});

			// After successful mutation, update local unread state
			handleClearMessageUnread({
				workspace_id: workspace?.id || '',
				channel_id: channel?.id || '',
			});
		} catch (error) {
			// Handle error if needed (e.g. show toast, log error)
			console.error('Failed to clear unread count:', error);
		}
	};

	const handleUpdateLastRead = async () => {
		if (!channel?.membership) return;
		try {
			await updateLastRead.mutateAsync({
				workspaceId: workspace?.id || '',
				channelId: channel?.id || '',
			});
		} catch (error) {
			console.error('Failed to update last read:', error);
		}
	};

	useEffect(() => {
		const tabList: ChannelTabProps[] = [];
		if (channel) {
			tabList.push({
				name: 'Messages',
				icon: MessageCircle,
			});
		}

		setTabs(tabList);

		return () => {
			if (channel?.membership?.unread_count) {
				handleClearUnreadCount();
				handleClearMessageUnread({ workspace_id: workspace?.id || '', channel_id: channel?.id || '' });
			}
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [channel]);

	useEffect(() => {
		return () => {
			handleUpdateLastRead();
			queryClient.removeQueries({ queryKey: ['messages', workspace?.id, channel?.id] });
			queryClient.removeQueries({ queryKey: ['channel', workspace?.id, channel?.id] });
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div className='flex-1 overflow-hidden'>
			{tabs && tabs.length > 0 && (
				<Tabs defaultValue={tabs?.[0]?.name} className='h-full w-full gap-0'>
					<TabsList className='h-10 w-full justify-start gap-1 rounded-none border-b bg-white px-4 py-0'>
						{tabs.map((tab) => (
							<TabsTrigger
								key={tab.name}
								value={tab.name}
								disabled={!channel?.membership}
								className='data-[state=active]:border-b-primary h-full flex-0 rounded-none border-b-2 border-transparent data-[state=active]:bg-white data-[state=active]:shadow-none'
							>
								<tab.icon />
								<span className='text-md font-semibold'>{tab.name}</span>
								{!!tab.count && (
									<Badge variant='secondary' className='ml-2 rounded-full px-1 py-0 text-xs'>
										{tab.count}
									</Badge>
								)}
							</TabsTrigger>
						))}
					</TabsList>
					<TabsContent value={tabs?.[0]?.name} className='overflow-hidden'>
						<div className='flex h-full w-full flex-col overflow-hidden'>
							<MessageList
								messages={messages}
								workspace={workspace}
								channel={channel}
								channelMembers={channel?.members}
								owner={channel?.members?.find((m) => m.role === 'owner')}
								onFetchOlder={fetchMoreOlder}
								onFetchNewer={fetchMoreNewer}
								isFetchingOlder={isFetchingOlder}
								isFetchingNewer={isFetchingNewer}
								hasMoreOlder={hasMoreOlder}
								hasMoreNewer={hasMoreNewer}
								isLoading={isLoading}
								handleClearUnreadCount={handleClearUnreadCount}
							/>
							{channel?.membership ? (
								<>
									<MessageInput
										placeholder='Write a message...'
										workspaceId={workspace?.id || ''}
										channelId={channel?.id || ''}
										disabled={!channel?.membership}
									/>
								</>
							) : (
								<div className='mb-8 px-4'>
									<div className='flex h-[120px] flex-col items-center justify-center gap-y-2 rounded-lg border'>
										<span className='text-sm font-semibold'>{channel?.name}</span>
										<div className='flex items-center gap-x-2'>
											<Button variant='default' size='sm' onClick={handleJoinChannel}>
												Join Channel
											</Button>
										</div>
									</div>
								</div>
							)}
						</div>
					</TabsContent>
				</Tabs>
			)}
		</div>
	);
};

export default ChannelContent;
