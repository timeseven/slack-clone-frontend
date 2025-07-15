import React from 'react';

import { MessageReadBase } from '@/types/message';
import Message from '@/features/message/components/Message';
import MessageInput from '@/features/message/components/MessageInput';
import useMessageStore from '@/features/message/stores/useMessageStore';

const ReplyPanel = ({ data }: { data: { messageId: string } }) => {
	const { messageId } = data;
	const message = useMessageStore((state) => state.getMessageById(messageId));

	if (!message) return null;

	return (
		<>
			<Message message={message} showReplies={false} />
			<div className='flex flex-col-reverse'>
				{message?.replies?.map((reply: MessageReadBase) => (
					<Message key={reply.id} message={reply} />
				))}
				{message?.replies?.length > 0 && (
					<div className='my-2 flex items-center gap-2 px-4'>
						<span className='text-muted-foreground text-sm whitespace-nowrap'>
							{`${message?.replies?.length} ${message?.replies?.length === 1 ? 'reply' : 'replies'}`}
						</span>
						<hr className='flex-grow border-t border-gray-300' />
					</div>
				)}
			</div>
			<MessageInput
				placeholder={`Reply to ${message.sender.full_name}...`}
				workspaceId={message.workspace_id}
				channelId={message.channel_id}
				parentId={message.id}
				className='mt-2'
			/>
		</>
	);
};

export default ReplyPanel;
