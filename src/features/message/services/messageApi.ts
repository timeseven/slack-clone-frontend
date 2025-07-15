import { fetcher } from '@/lib/fetcher';
import { MessageCreate, MessageRead, ReactionCreate } from '@/types/message';
import { ApiResponse } from '@/types/global';

export const getMessagesByWorkspace = async (
	workspaceId: string,
	params?: { before?: string; after?: string; limit?: number }
) => {
	const query = new URLSearchParams();
	if (params?.before) query.append('before', params.before);
	if (params?.after) query.append('after', params.after);
	if (params?.limit) query.append('limit', String(params.limit));

	const queryString = query.toString();
	const url = `/workspaces/${workspaceId}/messages${queryString ? `?${queryString}` : ''}`;

	return await fetcher<ApiResponse<MessageRead[]>>(url, {
		method: 'GET',
	});
};

export const getMessagesByChannel = async (
	workspaceId: string,
	channelId: string,
	params?: { before?: string; after?: string; limit?: number }
) => {
	const query = new URLSearchParams();
	if (params?.before) query.append('before', params.before);
	if (params?.after) query.append('after', params.after);
	if (params?.limit) query.append('limit', String(params.limit));

	const queryString = query.toString();
	const url = `/workspaces/${workspaceId}/channels/${channelId}/messages${queryString ? `?${queryString}` : ''}`;

	return await fetcher<ApiResponse<MessageRead[]>>(url, {
		method: 'GET',
	});
};

export const createMessage = async (workspaceId: string, channelId: string, data: MessageCreate) => {
	return await fetcher<ApiResponse<{ message_id: string }>>(
		`/workspaces/${workspaceId}/channels/${channelId}/messages`,
		{
			method: 'POST',
			body: JSON.stringify(data),
		}
	);
};

export const createReaction = async (
	workspaceId: string,
	channelId: string,
	messageId: string,
	data: ReactionCreate
) => {
	return await fetcher<ApiResponse<MessageRead>>(
		`/workspaces/${workspaceId}/channels/${channelId}/messages/${messageId}/reactions`,
		{
			method: 'POST',
			body: JSON.stringify(data),
		}
	);
};

export const deleteReaction = async (workspaceId: string, channelId: string, messageId: string, reactionId: string) => {
	return await fetcher<ApiResponse<MessageRead>>(
		`/workspaces/${workspaceId}/channels/${channelId}/messages/${messageId}/reactions/${reactionId}`,
		{
			method: 'DELETE',
		}
	);
};
