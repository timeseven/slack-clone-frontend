'use client';

import React, { useEffect, useState } from 'react';

import HomeCollapsibleItem from '@/features/workspace/components/HomeCollapsibleItem';
import { FolderIcon, FolderKey, Plus, Star } from 'lucide-react';

import ChannelCreateDialog from '@/features/channel/components/ChannelCreateDialog';
import { HomeCollapsibleItemProps } from '@/types/workspace';
import useWorkspaceStore from '@/features/workspace/stores/useWorkspaceStore';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/context/AuthContext';
import { useGetChannels } from '@/features/channel/hooks/useChannelApiHooks';
import { useGetWorkspace } from '@/features/workspace/hooks/useWorkspaceApiHooks';

const HomeSidebarList = () => {
	const { user } = useAuthContext();
	const currentWorkspaceId = useWorkspaceStore((state) => state.currentWorkspaceId);
	const setOpenInviteWorkspaceMemberDialog = useWorkspaceStore((state) => state.setOpenInviteWorkspaceMemberDialog);
	const { data: workspace } = useGetWorkspace(currentWorkspaceId!);
	const { data: allChannels } = useGetChannels(currentWorkspaceId!);
	const [openStates, setOpenStates] = useState<Record<string, boolean>>({
		starred: true,
		private: true,
		channels: true,
		direct_messages: true,
	});

	const [starGroup, setStarGroup] = useState<HomeCollapsibleItemProps>({
		id: 'starred',
		label: 'Starred',
		type: 'folder',
		children: [],
	});
	const [privateGroup, setPrivateGroup] = useState<HomeCollapsibleItemProps>({
		id: 'private',
		label: 'Private',
		type: 'folder',
		children: [],
	});
	const [channelGroup, setChannelGroup] = useState<HomeCollapsibleItemProps>({
		id: 'channels',
		label: 'Channels',
		type: 'folder',
		children: [],
		extra: <ChannelCreateDialog />,
	});
	const [dmGroup, setDmGroup] = useState<HomeCollapsibleItemProps>({
		id: 'direct_messages',
		label: 'Direct Messages',
		type: 'folder',
		children: [],
		extra: (
			<Button
				variant='ghost'
				size='sm'
				className='flex w-full items-center justify-start gap-2'
				onClick={() => setOpenInviteWorkspaceMemberDialog(true)}
			>
				<Plus className='h-4 w-4 rounded-sm' />
				Invite Members
			</Button>
		),
	});

	const handleOpenChange = (value: string, open: boolean) => {
		setOpenStates((prev) => ({
			...prev,
			[value]: open,
		}));
	};

	useEffect(() => {
		if (!allChannels || !workspace?.members) return;
		const starredChildren: HomeCollapsibleItemProps[] = [];
		const privateChildren: HomeCollapsibleItemProps[] = [];
		const channelChildren: HomeCollapsibleItemProps[] = [];
		const dmChildrenMap = new Map<string, HomeCollapsibleItemProps>();

		// If there is no dm channel, use workspace members
		for (const member of workspace?.members) {
			dmChildrenMap.set(member.id, {
				id: member.id,
				label: member.full_name,
				type: 'dm',
				path: `/workspace/${currentWorkspaceId}/members/${member.id}`,
				icon: member.avatar || member.full_name,
			});
		}

		for (const channel of allChannels) {
			const unread = channel.membership?.unread_count;
			const isStarred = channel.membership?.is_starred;
			const channelMembers = channel?.members || [];
			if (isStarred) {
				starredChildren.push({
					id: channel.id,
					label: channel.name,
					type: channel.type,
					path: `/workspace/${currentWorkspaceId}/${channel.id}`,
					icon: Star,
					badge: unread,
				});
			} else if (channel?.type === 'channel' && channel.is_private) {
				privateChildren.push({
					id: channel.id,
					label: channel.name,
					type: channel.type,
					path: `/workspace/${currentWorkspaceId}/${channel.id}`,
					icon: FolderKey,
					badge: unread,
				});
			} else if (channel?.type === 'channel') {
				channelChildren.push({
					id: channel.id,
					label: channel.name,
					type: channel.type,
					path: `/workspace/${currentWorkspaceId}/${channel.id}`,
					icon: FolderIcon,
					badge: unread,
				});
			} else if (channel.type === 'dm') {
				const otherMember = channelMembers.length > 1 ? channelMembers?.find((m) => m.id !== user?.id) : user;
				if (otherMember) {
					dmChildrenMap.set(otherMember.id, {
						id: channel.id,
						label: otherMember.full_name,
						type: channel.type,
						path: `/workspace/${currentWorkspaceId}/${channel.id}`,
						icon: otherMember.avatar || otherMember.full_name,
						badge: unread,
					});
				}
			} else if (channel.type === 'group_dm') {
				dmChildrenMap.set(channel.id, {
					id: channel.id,
					label: channel.name || channelMembers?.map((m) => m.full_name).join(', ') || '',
					type: channel.type,
					path: `/workspace/${currentWorkspaceId}/${channel.id}`,
					icon: channelMembers?.map((m) => m.avatar || m.full_name),
					badge: unread,
				});
			}
		}

		setStarGroup({ ...starGroup, children: starredChildren });
		setPrivateGroup({ ...privateGroup, children: privateChildren });
		setChannelGroup({ ...channelGroup, children: channelChildren });
		setDmGroup({ ...dmGroup, children: Array.from(dmChildrenMap.values()) });

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [allChannels, workspace]);

	return (
		<div className='overflow-y-auto p-4 text-white'>
			{/* <div className='flex w-full flex-col gap-y-1'>
				<MenuButtonItem label='Overview' path={`/workspace/${currentWorkspaceId}`} icon={Binoculars} />
			</div> */}
			<div className='flex flex-col justify-center gap-y-1'>
				{/* Starred */}
				{starGroup?.children && starGroup?.children?.length > 0 && (
					<HomeCollapsibleItem
						open={openStates['starred']}
						setOpen={(open) => handleOpenChange('starred', open)}
						{...starGroup}
					/>
				)}
				{/* Private */}
				{privateGroup?.children && privateGroup?.children?.length > 0 && (
					<HomeCollapsibleItem
						open={openStates['private']}
						setOpen={(open) => handleOpenChange('private', open)}
						{...privateGroup}
					/>
				)}
				{/* Channels/Public */}
				<HomeCollapsibleItem
					open={openStates['channels']}
					setOpen={(open) => handleOpenChange('channels', open)}
					{...channelGroup}
				/>
				{/* Direct messages */}
				<HomeCollapsibleItem
					open={openStates['direct_messages']}
					setOpen={(open) => handleOpenChange('direct_messages', open)}
					{...dmGroup}
				/>
			</div>
		</div>
	);
};

export default HomeSidebarList;
