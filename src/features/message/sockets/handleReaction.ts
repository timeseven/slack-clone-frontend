import type { InfiniteData } from '@tanstack/react-query';

import { queryClient } from '@/context/ReactQueryContext';
import { ApiResponse } from '@/types/global';
import { updateMessageTree } from '@/features/message/sockets/updateMessageTree';
import { MessageRead, ReactionRead } from '@/types/message';

export const handleReactionAdd = (data: {
	workspace_id: string;
	channel_id: string;
	message_id: string;
	reaction: ReactionRead;
}) => {
	const { workspace_id, channel_id, message_id, reaction } = data;

	queryClient.setQueryData(
		['messages', workspace_id, channel_id],
		(prev: InfiniteData<ApiResponse<MessageRead[]>> | undefined) => {
			if (!prev) return prev;

			return updateMessageTree(
				prev,
				(msg) => {
					if (msg.id !== message_id) return msg;

					const reactions = msg.reactions ?? [];
					if (reactions.find((r) => r.id === reaction.id)) return msg;

					return {
						...msg,
						reactions: [...reactions, reaction],
					};
				},
				(reply) => {
					if (reply.id !== message_id) return reply;

					const reactions = reply.reactions ?? [];
					if (reactions.find((r) => r.id === reaction.id)) return reply;

					return {
						...reply,
						reactions: [...reactions, reaction],
					};
				}
			);
		}
	);
};

export const handleReactionRemove = (data: {
	workspace_id: string;
	channel_id: string;
	message_id: string;
	reaction_id: string;
}) => {
	const { workspace_id, channel_id, message_id, reaction_id } = data;

	queryClient.setQueryData(
		['messages', workspace_id, channel_id],
		(prev: InfiniteData<ApiResponse<MessageRead[]>> | undefined) => {
			if (!prev) return prev;

			return updateMessageTree(
				prev,
				(msg) => {
					if (msg.id !== message_id) return msg;

					return {
						...msg,
						reactions: msg.reactions?.filter((r) => r.id !== reaction_id),
					};
				},
				(reply) => {
					if (reply.id !== message_id) return reply;

					return {
						...reply,
						reactions: reply.reactions?.filter((r) => r.id !== reaction_id),
					};
				}
			);
		}
	);
};
