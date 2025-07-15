import { useQuery, useMutation } from '@tanstack/react-query';
import {
	ChannelRead,
	ChannelCreate,
	ChannelUpdate,
	ChannelUpdateRole,
	ChannelTransfer,
	ChannelReadBase,
} from '@/types/channel';
import {
	getChannels,
	getChannel,
	createChannel,
	updateChannel,
	updateChannelRole,
	updateLastRead,
	transferChannel,
	searchChannels,
	deleteChannel,
	clearUnreadCount,
	joinChannel,
	leaveChannel,
	getOrCreateDms,
} from '@/features/channel/services/channelApi';

export const useGetChannels = (workspaceId: string, options = {}) => {
	return useQuery({
		queryKey: ['channels', workspaceId],
		queryFn: () => getChannels(workspaceId),
		select: (response: { data: ChannelRead[] }) => response.data,
		enabled: !!workspaceId,
		...options,
	});
};

export const useGetChannel = (workspaceId: string, channelId: string, options = {}) => {
	return useQuery({
		queryKey: ['channel', workspaceId, channelId],
		queryFn: () => getChannel(workspaceId, channelId),
		select: (response: { data: ChannelRead }) => response.data,
		enabled: !!workspaceId && !!channelId,
		...options,
	});
};

export const useSearchChannels = (workspaceId: string, query: string, options = {}) => {
	return useQuery({
		queryKey: ['channels_search', workspaceId, query],
		queryFn: () => searchChannels(workspaceId, query),
		select: (response: { data: ChannelReadBase[] }) => response.data,
		enabled: !!workspaceId && !!query.trim(),
		...options,
	});
};

export const useCreateChannel = () => {
	return useMutation({
		mutationFn: ({ workspaceId, data }: { workspaceId: string; data: ChannelCreate }) =>
			createChannel(workspaceId, data),
	});
};

export const useUpdateChannel = () => {
	return useMutation({
		mutationFn: ({ workspaceId, channelId, data }: { workspaceId: string; channelId: string; data: ChannelUpdate }) =>
			updateChannel(workspaceId, channelId, data),
	});
};

export const useDeleteChannel = () => {
	return useMutation({
		mutationFn: ({ workspaceId, channelId }: { workspaceId: string; channelId: string }) =>
			deleteChannel(workspaceId, channelId),
	});
};

export const useUpdateChannelRole = () => {
	return useMutation({
		mutationFn: ({
			workspaceId,
			channelId,
			data,
		}: {
			workspaceId: string;
			channelId: string;
			data: ChannelUpdateRole;
		}) => updateChannelRole(workspaceId, channelId, data),
	});
};

export const useUpdateLastRead = () => {
	return useMutation({
		mutationFn: ({ workspaceId, channelId }: { workspaceId: string; channelId: string }) =>
			updateLastRead(workspaceId, channelId),
	});
};

export const useTransferChannel = () => {
	return useMutation({
		mutationFn: ({ workspaceId, channelId, data }: { workspaceId: string; channelId: string; data: ChannelTransfer }) =>
			transferChannel(workspaceId, channelId, data),
	});
};

export const useClearUnreadCount = () => {
	return useMutation({
		mutationFn: ({ workspaceId, channelId }: { workspaceId: string; channelId: string }) =>
			clearUnreadCount(workspaceId, channelId),
	});
};

export const useJoinChannel = () => {
	return useMutation({
		mutationFn: ({ workspaceId, channelId }: { workspaceId: string; channelId: string }) =>
			joinChannel(workspaceId, channelId),
	});
};

export const useLeaveChannel = () => {
	return useMutation({
		mutationFn: ({ workspaceId, channelId }: { workspaceId: string; channelId: string }) =>
			leaveChannel(workspaceId, channelId),
	});
};

export const useGetOrCreateDms = () => {
	return useMutation({
		mutationFn: ({ workspaceId, userId }: { workspaceId: string; userId: string }) =>
			getOrCreateDms(workspaceId, userId),
	});
};
