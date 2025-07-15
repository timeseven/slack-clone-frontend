'use client';

import { useMemo, useState } from 'react';
import { Crown, Search, ShieldUser, UserRound, UserRoundMinus, UserRoundPlus } from 'lucide-react';

import useDebounce from '@/hooks/useDebounce';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import MemberList from '@/features/user/components/MemberList';
import { ChannelMemberRole, ChannelRead } from '@/types/channel';
import Hint from '@/components/global/Hint';
import Loading from '@/components/svg/Loading';
import { cn, createDelta } from '@/lib/utils';
import { queryClient } from '@/context/ReactQueryContext';
import { WorkspaceMemberRead, WorkspaceRead } from '@/types/workspace';
import { useTransferChannel, useUpdateChannelRole } from '@/features/channel/hooks/useChannelApiHooks';
import { useCreateMessage } from '@/features/message/hooks/useMessageApiHooks';

const ChannelMemberSearch = ({
	workspace,
	channel,
	onSuccess,
}: {
	workspace?: WorkspaceRead;
	channel?: ChannelRead;
	onSuccess?: () => void;
}) => {
	const [searchValue, setSearchValue] = useState('');
	const debouncedSearchValue = useDebounce(searchValue, 500);
	const filterDebouncedValue = String(debouncedSearchValue).replace(/\s+/g, ' ').trim();

	const transferChannel = useTransferChannel();
	const udpateChannelRole = useUpdateChannelRole();
	const createMessage = useCreateMessage();

	const inChannelSearchMembers = useMemo(() => {
		return channel?.members?.filter((member) => {
			return member.full_name.toLowerCase().includes(filterDebouncedValue.toLowerCase());
		});
	}, [filterDebouncedValue, channel?.members]);

	const outChannelSearchMembers = useMemo(() => {
		const filteredMembers = workspace?.members?.filter((member) => {
			return (
				!channel?.members?.some((channelMember) => channelMember.id === member.id) &&
				member.full_name.toLowerCase().includes(filterDebouncedValue.toLowerCase())
			);
		});

		return filteredMembers?.map((member) => {
			return {
				...member,
				role: null,
			};
		});
	}, [filterDebouncedValue, channel?.members, workspace]);

	// eslint-disable-next-line
	const handleTransferChannel = async (member: WorkspaceMemberRead) => {
		try {
			await transferChannel.mutateAsync({
				workspaceId: channel?.workspace_id || '',
				channelId: channel?.id || '',
				data: {
					user_id: member.id,
				},
			});

			onSuccess?.();

			await createMessage.mutateAsync({
				workspaceId: channel?.workspace_id || '',
				channelId: channel?.id || '',
				data: {
					content: createDelta(`transfer the channel to ${member.full_name}`),
					parent_id: null,
					message_type: 'message_system',
				},
			});
		} catch (error) {
			console.log(error);
		}
	};

	// eslint-disable-next-line
	const handleUpdateChannelRole = async (member: WorkspaceMemberRead, role: ChannelMemberRole) => {
		try {
			await udpateChannelRole.mutateAsync({
				workspaceId: channel?.workspace_id || '',
				channelId: channel?.id || '',
				data: {
					user_id: member.id,
					role,
				},
			});
			queryClient.invalidateQueries({ queryKey: ['channel', channel?.workspace_id, channel?.id] });

			onSuccess?.();

			await createMessage.mutateAsync({
				workspaceId: channel?.workspace_id || '',
				channelId: channel?.id || '',
				data: {
					content: createDelta(`update ${member.full_name}'s role to ${role}`),
					parent_id: null,
					message_type: 'message_system',
				},
			});
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='relative flex h-[500px] flex-col gap-2'>
			<div className='focus-within:ring-ring relative mx-5 flex items-center rounded-md border pl-2 focus-within:ring-1'>
				<Search className='text-muted-foreground h-5 w-5' />
				<Input
					type='email'
					placeholder='Find or add a member'
					className='border-0 shadow-none focus-visible:ring-0'
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
					autoFocus
				/>
			</div>
			{searchValue && searchValue !== debouncedSearchValue && (
				<Loading className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
			)}
			<div className={cn('flex flex-col')}>
				{filterDebouncedValue && <span className='px-5 text-sm font-semibold text-gray-400'>In this channel</span>}
				<MemberList
					members={inChannelSearchMembers}
					extra={(member) => {
						return (
							<>
								{/* Transfer ownership */}
								{channel?.membership?.role === 'owner' && member?.role !== 'owner' && (
									<Hint label='Transfer ownership' side='top' align='center'>
										<Button
											variant='default'
											size='icon'
											onClick={async () => {
												// handleTransferChannel(member);
											}}
										>
											<Crown />
										</Button>
									</Hint>
								)}
								{/* Set admin to member */}
								{channel?.membership?.role === 'owner' && member?.role === 'admin' && (
									<Hint label='Set as user' side='top' align='center'>
										<Button
											variant='default'
											size='icon'
											onClick={async () => {
												// handleUpdateChannelRole(member, 'member');
											}}
										>
											<UserRound />
										</Button>
									</Hint>
								)}
								{/* Set member to admin */}
								{channel?.membership?.role === 'owner' && member?.role === 'member' && (
									<Hint label='Set as admin' side='top' align='center'>
										<Button
											variant='default'
											size='icon'
											onClick={async () => {
												// handleUpdateChannelRole(member, 'admin');
											}}
										>
											<ShieldUser />
										</Button>
									</Hint>
								)}
								{/* Remove from channel */}
								{channel?.membership?.role === 'owner' && member?.role !== 'owner' && (
									<Hint label='Remove from channel' side='top' align='center'>
										<Button variant='destructive' size='icon' onClick={async () => {}}>
											<UserRoundMinus />
										</Button>
									</Hint>
								)}
							</>
						);
					}}
				/>
			</div>
			{filterDebouncedValue && outChannelSearchMembers && outChannelSearchMembers.length > 0 && (
				<div className={cn('flex flex-col')}>
					<span className='px-5 text-sm font-semibold text-gray-400'>Not in this channel</span>
					<MemberList
						members={outChannelSearchMembers}
						extra={(member) => {
							return (
								<>
									{channel?.membership?.role === 'owner' && member?.role !== 'owner' && (
										<Hint label='Add to channel' side='top' align='center'>
											<Button variant='default' size='icon' onClick={async () => {}}>
												<UserRoundPlus />
											</Button>
										</Hint>
									)}
								</>
							);
						}}
					/>
				</div>
			)}
		</div>
	);
};

export default ChannelMemberSearch;
