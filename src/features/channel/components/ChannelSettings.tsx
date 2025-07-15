'use client';

import { Globe, Lock, Trash2 } from 'lucide-react';

import { createDelta } from '@/lib/utils';
import { ChannelRead } from '@/types/channel';
import { useUpdateChannel } from '@/features/channel/hooks/useChannelApiHooks';
import { useCreateMessage } from '@/features/message/hooks/useMessageApiHooks';

const ChannelSettings = ({ channel, onSuccess }: { channel?: ChannelRead; onSuccess?: () => void }) => {
	const updateChannel = useUpdateChannel();
	const createMessage = useCreateMessage();

	const handleUpdatePrivacy = async () => {
		try {
			await updateChannel.mutateAsync({
				workspaceId: channel?.workspace_id || '',
				channelId: channel?.id || '',
				data: {
					is_private: !channel?.is_private,
				},
			});

			onSuccess?.();

			await createMessage.mutateAsync({
				workspaceId: channel?.workspace_id || '',
				channelId: channel?.id || '',
				data: {
					content: createDelta(`set the channel as ${channel?.is_private ? 'public' : 'private'}`),
					parent_id: null,
					message_type: 'message_system',
				},
			});
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div className='flex flex-col gap-2'>
			<div
				className='hover:bg-secondary flex cursor-pointer items-center gap-2 rounded-lg border p-4'
				onClick={handleUpdatePrivacy}
			>
				{channel?.is_private ? (
					<>
						<Globe className='text-primary' />
						<span className='text-primary font-semibold'>Set as public</span>
					</>
				) : (
					<>
						<Lock className='text-primary' />
						<span className='text-primary font-semibold'>Set as private</span>
					</>
				)}
			</div>
			{channel?.membership?.role === 'owner' && (
				<div className='hover:bg-secondary flex cursor-pointer items-center gap-2 rounded-lg border p-4'>
					<Trash2 className='text-destructive' />
					<span className='text-destructive font-semibold'>Delete Channel</span>
				</div>
			)}
		</div>
	);
};

export default ChannelSettings;
