import type { InfiniteData } from '@tanstack/react-query';

import { queryClient } from '@/context/ReactQueryContext';
import { ApiResponse } from '@/types/global';
import { MessageRead } from '@/types/message';
import { updateMessageTree } from '@/features/message/sockets/updateMessageTree';
import { ChannelRead } from '@/types/channel';

export const handleMessageSend = (data: { workspace_id: string; channel_id: string; message: MessageRead }) => {
	const { workspace_id, channel_id, message } = data;

	queryClient.setQueryData(
		['messages', workspace_id, channel_id],
		(prev: InfiniteData<ApiResponse<MessageRead[]>> | undefined) => {
			if (!prev) return prev;

			// If the message is not a reply
			if (!message.parent_id) {
				// If the message is already in the cache, do nothing
				const existing = prev.pages.some((page) => page.data.some((m) => m.id === message.id));
				if (existing) return prev;

				const newPages = [
					{
						...prev.pages[0],
						data: [message, ...prev.pages[0].data],
					},
					...prev.pages.slice(1),
				];

				return { ...prev, pages: newPages };
			}

			// If the message is a reply, update the cache
			const updated = updateMessageTree(prev, (msg) => {
				if (msg.id !== message.parent_id) return msg;

				// If the message is already in the replies, do nothing
				const replies = msg.replies ?? [];
				if (replies.find((r) => r.id === message.id)) {
					return msg;
				}
				return {
					...msg,
					replies: [message, ...replies],
				};
			});
			return updated;
		}
	);
};

export const handleMessageUnread = (data: { workspace_id: string; channel_id: string }) => {
	const { workspace_id, channel_id } = data;
	queryClient.setQueryData(['channels', workspace_id], (prev: ApiResponse<ChannelRead[]> | undefined) => {
		if (!prev) return prev;

		return {
			...prev,
			data: prev.data.map((c) => {
				if (c.id === channel_id) {
					return {
						...c,
						membership: {
							...c.membership,
							unread_count: c.membership!.unread_count + 1,
						},
					};
				}
				return c;
			}),
		};
	});

	queryClient.setQueryData(['channel', workspace_id, channel_id], (prev: ApiResponse<ChannelRead> | undefined) => {
		if (!prev) return prev;
		console.log('channel last read at', new Date(prev.data.membership?.last_read_at || 0).toLocaleString());
		return {
			...prev,
			data: {
				...prev.data,
				membership: {
					...prev.data.membership,
					unread_count: prev.data.membership!.unread_count + 1,
				},
			},
		};
	});
};

export const handleClearMessageUnread = (data: { workspace_id: string; channel_id: string }) => {
	const { workspace_id, channel_id } = data;
	queryClient.setQueryData(['channels', workspace_id], (prev: ApiResponse<ChannelRead[]> | undefined) => {
		if (!prev) return prev;

		return {
			...prev,
			data: prev.data.map((c) => {
				if (c.id === channel_id) {
					return {
						...c,
						membership: {
							...c.membership,
							unread_count: 0,
						},
					};
				}
				return c;
			}),
		};
	});

	queryClient.setQueryData(['channel', workspace_id, channel_id], (prev: ApiResponse<ChannelRead> | undefined) => {
		if (!prev) return prev;

		return {
			...prev,
			data: {
				...prev.data,
				membership: {
					...prev.data.membership,
					unread_count: 0,
				},
			},
		};
	});
};
