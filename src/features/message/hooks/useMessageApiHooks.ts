import { useMemo } from 'react';

import { useInfiniteQuery, InfiniteData, useMutation, useQuery } from '@tanstack/react-query';

import { ApiResponse } from '@/types/global';
import { initialPageSize, pageSize } from '@/consts/general';
import { MessageRead, MessagePagination, MessageCreate, ReactionCreate } from '@/types/message';
import {
	getMessagesByChannel,
	createMessage,
	createReaction,
	deleteReaction,
	getMessagesByWorkspace,
} from '@/features/message/services/messageApi';

interface Options {
	workspaceId: string;
	channelId: string;
	lastReadTimestamp?: string;
}

export const useBidirectionalMessages = ({ workspaceId, channelId }: Options) => {
	const query = useInfiniteQuery<
		ApiResponse<MessageRead[]>, // TQueryFnData
		Error, // TError
		InfiniteData<ApiResponse<MessageRead[]>>, // TData
		string[], // TQueryKey
		MessagePagination // TPageParam - explicitly specify this
	>({
		queryKey: ['messages', workspaceId, channelId],
		queryFn: async ({ pageParam }: { pageParam: MessagePagination }) => {
			return getMessagesByChannel(workspaceId, channelId, pageParam);
		},

		enabled: !!workspaceId && !!channelId,

		// Get newer messages (forward pagination)
		getNextPageParam: (lastPage) => {
			const data = lastPage.data;
			if (data.length < pageSize) return undefined;
			// Return object with 'after' to fetch newer messages
			return { after: data[0]?.created_at, limit: pageSize, before: undefined };
		},

		// Get older messages (backward pagination)
		getPreviousPageParam: (firstPage) => {
			const data = firstPage.data;
			if (data.length < pageSize) return undefined;
			// Return object with 'before' to fetch older messages
			return { before: data[data.length - 1]?.created_at, limit: pageSize, after: undefined };
		},

		initialPageParam: { before: new Date().toISOString(), limit: initialPageSize, after: undefined },

		// Optional: limit max pages to avoid memory issues
		maxPages: 50,
	});

	// Merge all pages and sort messages
	const messages = useMemo(() => {
		if (!query.data?.pages) return [];

		const allMessages = query.data.pages.flatMap((page) => page.data);

		// Sort by time and deduplicate
		const uniqueMessages = new Map<string, MessageRead>();
		allMessages.forEach((msg) => uniqueMessages.set(msg.id, msg));

		return Array.from(uniqueMessages.values()).sort(
			(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
		);
	}, [query.data]);

	return {
		messages,
		// Load newer messages (forward pagination)
		fetchMoreNewer: query.fetchNextPage,
		// Load older messages (backward pagination)
		fetchMoreOlder: query.fetchPreviousPage,
		// Loading states
		isFetchingNewer: query.isFetchingNextPage,
		isFetchingOlder: query.isFetchingPreviousPage,
		// Whether there's more data available
		hasMoreNewer: query.hasNextPage,
		hasMoreOlder: query.hasPreviousPage,
		// Other states
		isLoading: query.isLoading,
		isError: query.isError,
		error: query.error,
	};
};

export const useCreateMessage = () => {
	return useMutation({
		mutationFn: ({ workspaceId, channelId, data }: { workspaceId: string; channelId: string; data: MessageCreate }) =>
			createMessage(workspaceId, channelId, data),
	});
};

export const useCreateReaction = () => {
	return useMutation({
		mutationFn: ({
			workspaceId,
			channelId,
			messageId,
			data,
		}: {
			workspaceId: string;
			channelId: string;
			messageId: string;
			data: ReactionCreate;
		}) => createReaction(workspaceId, channelId, messageId, data),
	});
};

export const useDeleteReaction = () => {
	return useMutation({
		mutationFn: ({
			workspaceId,
			channelId,
			messageId,
			reactionId,
		}: {
			workspaceId: string;
			channelId: string;
			messageId: string;
			reactionId: string;
		}) => deleteReaction(workspaceId, channelId, messageId, reactionId),
	});
};

export const useGetMessagesByWorkspace = (workspaceId: string, paginationParams: MessagePagination, options = {}) => {
	return useQuery({
		queryKey: ['messages', workspaceId, paginationParams],
		queryFn: () => getMessagesByWorkspace(workspaceId, paginationParams),
		select: (response: { data: MessageRead[] }) => response.data,
		enabled: !!workspaceId,
		...options,
	});
};
