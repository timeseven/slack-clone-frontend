import { ApiResponse } from '@/types/global';
import { MessageRead, MessageReadBase } from '@/types/message';
import type { InfiniteData } from '@tanstack/react-query';

type MessageTransformer = (msg: MessageRead) => MessageRead;
type ReplyTransformer = (reply: MessageReadBase) => MessageReadBase;

export function updateMessageTree(
	data: InfiniteData<ApiResponse<MessageRead[]>> | undefined,
	transformer: MessageTransformer,
	replyTransformer?: ReplyTransformer
): InfiniteData<ApiResponse<MessageRead[]>> | undefined {
	if (!data) return data;

	const newPages = data.pages.map((page) => {
		const updatedData = page.data.map((msg) => {
			const updatedMsg = transformer(msg);

			let updatedReplies = updatedMsg.replies ?? [];

			if (replyTransformer) {
				updatedReplies = updatedReplies.map(replyTransformer);
			}

			return { ...updatedMsg, replies: updatedReplies };
		});

		return { ...page, data: updatedData };
	});

	return { ...data, pages: newPages };
}
