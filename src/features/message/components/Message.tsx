'use client';

import React, { useEffect } from 'react';

import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

import Hint from '@/components/global/Hint';
import DeltaRenderer from '@/components/global/DeltaRenderer';
import AvatarContainer from '@/components/global/AvatarContainer';
import Replies from '@/features/message/components/Replies';
import Reactions from '@/features/message/components/Reactions';
import ActionToolbar from '@/features/message/components/ActionToolbar';
import MessageInput from '@/features/message/components/MessageInput';

import useRouteStore from '@/stores/useRouteStore';
import useLayoutStore from '@/stores/useLayoutStore';
import useMessageStore from '@/features/message/stores/useMessageStore';

import { cn } from '@/lib/utils';
import { MessageRead, MessageReadBase } from '@/types/message';
import { useAuthContext } from '@/context/AuthContext';
import { editThreadholdMs } from '@/consts/message';
import { useCreateReaction, useDeleteReaction } from '@/features/message/hooks/useMessageApiHooks';
import { WorkspaceRead } from '@/types/workspace';

function hasReplies(message: MessageRead | MessageReadBase): message is MessageRead {
	return 'replies' in message;
}

const Message = ({
	disabled,
	message,
	workspace,
	isEditing = false,
	isCompact = false,
	showReplies = true,
}: {
	disabled?: boolean;
	message: MessageRead | MessageReadBase;
	workspace?: WorkspaceRead;
	image?: string;
	isEditing?: boolean;
	isCompact?: boolean;
	showReplies?: boolean;
}) => {
	const isEdited = new Date(message?.updated_at).getTime() - new Date(message?.created_at).getTime() > editThreadholdMs;
	const isReplyable = message?.message_type !== 'message_system';

	const { user } = useAuthContext();
	const currentMenu = useRouteStore((state) => state.currentMenu);
	const setRightSidebarOpenMap = useLayoutStore((state) => state.setRightSidebarOpenMap);
	const setRightSidebarTypeMap = useLayoutStore((state) => state.setRightSidebarTypeMap);
	const setRightSidebarDataMap = useLayoutStore((state) => state.setRightSidebarDataMap);
	const setMessage = useMessageStore((state) => state.setMessage);
	const createReaction = useCreateReaction();
	const deleteReaction = useDeleteReaction();

	const handleReaction = async (emoji: string) => {
		if (!user) return;
		const sender_id = user?.id;
		const existingReaction =
			message.reactions &&
			message.reactions.find((reaction) => reaction.emoji === emoji && reaction.sender_id === sender_id);

		if (existingReaction) {
			try {
				await deleteReaction.mutateAsync({
					workspaceId: message.workspace_id,
					channelId: message.channel_id,
					messageId: message.id,
					reactionId: existingReaction.id,
				});
			} catch (error) {
				console.error('Failed to delete reaction:', error);
			}
		} else {
			try {
				await createReaction.mutateAsync({
					workspaceId: message.workspace_id,
					channelId: message.channel_id,
					messageId: message.id,
					data: {
						emoji,
					},
				});
			} catch (error) {
				console.error('Failed to create reaction:', error);
			}
		}
	};

	const handleReply = () => {
		if (disabled) return;
		setRightSidebarTypeMap(currentMenu, 'Reply');
		setRightSidebarDataMap(currentMenu, { messageId: message.id });
		setRightSidebarOpenMap(currentMenu, true);
	};

	const handleEdit = () => {};

	const handleProfile = (user_id: string) => {
		if (disabled) return;
		setRightSidebarTypeMap(currentMenu, 'Profile');
		setRightSidebarDataMap(currentMenu, { userId: user_id });
		setRightSidebarOpenMap(currentMenu, true);
	};

	useEffect(() => {
		setMessage(message);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [message]);

	return (
		<div
			className={cn(
				'group/message hover:bg-muted relative flex items-start gap-2 p-1.5 px-5',
				isEditing && 'bg-[#F2C74433] hover:bg-[#F2C74433]'
			)}
		>
			{!isCompact ? (
				<Button
					variant='ghost'
					disabled={disabled}
					className='size-10 p-0'
					onClick={() => handleProfile(message?.sender?.id)}
				>
					<AvatarContainer
						src={message?.sender?.avatar}
						alt={message?.sender?.full_name || 'User'}
						name={message?.sender?.full_name || 'U'}
						avatarClassName='size-10 rounded-lg'
						fallbackClassName='bg-primary text-white'
					/>
				</Button>
			) : (
				<Hint label={format(new Date(message?.created_at), "d MMMM 'at' h:mm:ss a")}>
					<button className='text-muted-foreground invisible flex h-[25px] w-10 items-center px-2 text-xs group-hover/message:visible hover:underline'>
						{format(new Date(message?.created_at), 'h:mm')}
					</button>
				</Hint>
			)}
			{isEditing ? (
				<MessageInput
					variant='update'
					workspaceId={message.workspace_id}
					channelId={message.channel_id}
					defaultValue={JSON.parse(message.content)}
					className='h-full w-full'
				/>
			) : (
				<div className='relative flex w-full flex-col overflow-hidden'>
					{!isCompact && (
						<div className='h-5 text-sm'>
							<Button
								variant='link'
								size='sm'
								className='inline-block h-full max-w-[30%] truncate px-0'
								disabled={disabled}
								onClick={() => handleProfile(message?.sender?.id)}
							>
								{message?.sender?.full_name}
							</Button>
							<span className='text-muted-foreground/50'>
								{user?.id === message?.sender?.id && '(You)'}&nbsp;&nbsp;
							</span>
							<Hint
								label={
									<span className='flex flex-col items-center'>
										<span>Open in channel</span>
										<span className='text-muted'>{format(new Date(message?.created_at), "d MMMM 'at' h:mm:ss a")}</span>
									</span>
								}
							>
								<button className='text-muted-foreground text-xs hover:underline'>
									{format(new Date(message?.created_at), "cccc 'at' h:mm a")}
								</button>
							</Hint>
						</div>
					)}
					<DeltaRenderer delta={JSON.parse(message?.content)} />

					{/* <Thumbnail url={image} /> */}
					{isEdited && <span className='text-muted-foreground text-xs'>(edited)</span>}
					{!!message?.reactions?.length && (
						<Reactions
							disabled={disabled}
							user={user}
							members={workspace?.members}
							reactions={message?.reactions}
							onChange={handleReaction}
						/>
					)}
					{!!(showReplies && hasReplies(message) && message?.replies?.length) && (
						<Replies disabled={disabled} replies={message?.replies} onReply={handleReply} />
					)}
				</div>
			)}
			{!isEditing && !disabled && (
				<ActionToolbar
					className='-top-3'
					isReplyable={isReplyable}
					onReaction={handleReaction}
					onEdit={handleEdit}
					onReply={handleReply}
				/>
			)}
		</div>
	);
};

export default Message;
