import { queryClient } from '@/context/ReactQueryContext';
import { ChannelRead, ChannelUpdate } from '@/types/channel';
import { ApiResponse } from '@/types/global';

export const handleChannelCreate = (data: { workspace_id: string; channel_type: string }) => {
	const { workspace_id, channel_type } = data;

	if (channel_type === 'dm') {
		queryClient.invalidateQueries({ queryKey: ['channels', workspace_id] });
	}
};

export const handleChannelUpdate = (data: { workspace_id: string; channel_id: string; channel: ChannelUpdate }) => {
	const { workspace_id, channel_id, channel } = data;

	queryClient.setQueryData(['channels', workspace_id], (prev: ApiResponse<ChannelRead[]> | undefined) => {
		if (!prev) return prev;

		return {
			...prev,
			data: prev.data.map((c) => {
				if (c.id === channel_id) {
					return {
						...c,
						...channel,
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
				...channel,
			},
		};
	});
};

export const handleChannelDelete = (data: { workspace_id: string; channel_id: string }) => {
	const { workspace_id, channel_id } = data;
	console.log('handleChannelDelete', workspace_id, channel_id);
};
