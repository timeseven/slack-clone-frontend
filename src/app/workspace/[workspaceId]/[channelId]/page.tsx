'use client';

import { useParams } from 'next/navigation';

import useWorkspaceStore from '@/features/workspace/stores/useWorkspaceStore';

import { useAuthContext } from '@/context/AuthContext';
import ChannelHeader from '@/features/channel/components/ChannelHeader';
import ChannelContent from '@/features/channel/components/ChannelContent';
import ChannelUpdateDialog from '@/features/channel/components/ChannelUpdateDialog';
import { useGetChannel } from '@/features/channel/hooks/useChannelApiHooks';
import { useGetWorkspace } from '@/features/workspace/hooks/useWorkspaceApiHooks';

const ChannelIdPage = () => {
	const params = useParams<{ channelId: string }>();
	const currentWorkspaceId = useWorkspaceStore((state) => state.currentWorkspaceId);
	const channelId = params.channelId;
	const { user } = useAuthContext();
	const { data: workspace } = useGetWorkspace(currentWorkspaceId!);
	const { data: channel, isLoading: channelLoading } = useGetChannel(currentWorkspaceId!, channelId!);

	if (channelLoading) {
		return null;
	}

	return (
		<div className='flex h-full w-full flex-col'>
			<ChannelHeader channel={channel} user={user} />
			<ChannelContent workspace={workspace} channel={channel} />
			<ChannelUpdateDialog workspace={workspace} channel={channel} />
		</div>
	);
};

export default ChannelIdPage;
