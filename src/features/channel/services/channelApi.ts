import { fetcher } from '@/lib/fetcher';
import {
	ChannelCreate,
	ChannelCreateRead,
	ChannelRead,
	ChannelTransfer,
	ChannelUpdate,
	ChannelReadBase,
	ChannelUpdateRole,
} from '@/types/channel';
import { ApiResponse } from '@/types/global';

export const getChannels = async (workspaceId: string) => {
	return await fetcher<ApiResponse<ChannelRead[]>>(`/workspaces/${workspaceId}/channels`, { method: 'GET' });
};

export const searchChannels = async (workspaceId: string, query: string) => {
	return await fetcher<ApiResponse<ChannelReadBase[]>>(`/workspaces/${workspaceId}/channels/search?query=${query}`, {
		method: 'GET',
	});
};

export const createChannel = async (workspaceId: string, data: ChannelCreate) => {
	return await fetcher<ApiResponse<ChannelCreateRead>>(`/workspaces/${workspaceId}/channels`, {
		method: 'POST',
		body: JSON.stringify(data),
	});
};

export const getChannel = async (workspaceId: string, channelId: string) => {
	return await fetcher<ApiResponse<ChannelRead>>(`/workspaces/${workspaceId}/channels/${channelId}`, {
		method: 'GET',
	});
};

export const updateChannel = async (workspaceId: string, channelId: string, data: ChannelUpdate) => {
	return await fetcher<ApiResponse<ChannelRead>>(`/workspaces/${workspaceId}/channels/${channelId}`, {
		method: 'PATCH',
		body: JSON.stringify(data),
	});
};

export const deleteChannel = async (workspaceId: string, channelId: string) => {
	return await fetcher<ApiResponse<null>>(`/workspaces/${workspaceId}/channels/${channelId}`, {
		method: 'DELETE',
	});
};

export const updateLastRead = async (workspaceId: string, channelId: string) => {
	return await fetcher<ApiResponse<null>>(`/workspaces/${workspaceId}/channels/${channelId}/last-read`, {
		method: 'PATCH',
	});
};

export const clearUnreadCount = async (workspaceId: string, channelId: string) => {
	return await fetcher<ApiResponse<null>>(`/workspaces/${workspaceId}/channels/${channelId}/clear-unread`, {
		method: 'PATCH',
	});
};

export const transferChannel = async (workspaceId: string, channelId: string, data: ChannelTransfer) => {
	return await fetcher<ApiResponse<ChannelRead>>(`/workspaces/${workspaceId}/channels/${channelId}/transfer`, {
		method: 'POST',
		body: JSON.stringify(data),
	});
};

export const updateChannelRole = async (workspaceId: string, channelId: string, data: ChannelUpdateRole) => {
	return await fetcher<ApiResponse<null>>(`/workspaces/${workspaceId}/channels/${channelId}/set-role`, {
		method: 'PATCH',
		body: JSON.stringify(data),
	});
};

export const joinChannel = async (workspaceId: string, channelId: string) => {
	return await fetcher<ApiResponse<ChannelRead>>(`/workspaces/${workspaceId}/channels/${channelId}/join`, {
		method: 'POST',
	});
};

export const leaveChannel = async (workspaceId: string, channelId: string) => {
	return await fetcher<ApiResponse<null>>(`/workspaces/${workspaceId}/channels/${channelId}/leave`, {
		method: 'POST',
	});
};

export const getOrCreateDms = async (workspaceId: string, userId: string) => {
	return await fetcher<ApiResponse<ChannelCreateRead>>(`/workspaces/${workspaceId}/channels/dms/${userId}`, {
		method: 'POST',
	});
};
