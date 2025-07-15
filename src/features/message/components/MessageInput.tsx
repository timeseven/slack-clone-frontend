'use client';

import { useRef } from 'react';

import dynamic from 'next/dynamic';
import { Delta, Op } from 'quill/core';

import { cn } from '@/lib/utils';
import { EditorHandle } from '@/components/global/Editor';
import { useCreateMessage } from '@/features/message/hooks/useMessageApiHooks';

const Editor = dynamic(() => import('@/components/global/Editor'), {
	ssr: false,
});

const MessageInput = ({
	workspaceId,
	channelId,
	parentId,
	disabled,
	className,
	defaultValue,
	placeholder,
	variant = 'create',
}: {
	workspaceId: string;
	channelId: string;
	parentId?: string;
	disabled?: boolean;
	className?: string;
	defaultValue?: Delta | Op[];
	placeholder?: string;
	variant?: 'create' | 'update';
}) => {
	const editorRef = useRef<EditorHandle>(null);
	const createMessage = useCreateMessage();
	const handleSubmit = async ({ image, body }: { image: File | null; body: string }) => {
		const messageId = await handleSendMessage(body);
		console.log('handleSendMessage', messageId, image);
	};
	const handleSendMessage = async (content: string) => {
		try {
			const res = await createMessage.mutateAsync({
				workspaceId: workspaceId!,
				channelId: channelId!,
				data: {
					content: content,
					parent_id: parentId,
					message_type: 'message_user',
				},
			});
			editorRef.current?.resetEditor();
			const { message_id } = res.data;
			return message_id;
		} catch (error) {
			console.error('Failed to send message:', error);
		}
	};

	return (
		<div className={cn('px-4', className)}>
			<Editor
				variant={variant}
				onSubmit={handleSubmit}
				placeholder={placeholder}
				innerRef={editorRef}
				disabled={disabled}
				defaultValue={defaultValue}
			/>
		</div>
	);
};

export default MessageInput;
