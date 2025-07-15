import React, { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ChannelRead } from '@/types/channel';
import { createDelta } from '@/lib/utils';
import { useUpdateChannel } from '@/features/channel/hooks/useChannelApiHooks';
import { useCreateMessage } from '@/features/message/hooks/useMessageApiHooks';

const ChannelUpdateDescriptionDialog = ({
	open,
	onOpenChange,
	channel,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	channel?: ChannelRead;
}) => {
	const [channelDescription, setChannelDescription] = useState(channel?.description || '');
	const updateChannel = useUpdateChannel();
	const createMessage = useCreateMessage();

	const handleEditDesSubmit = async () => {
		try {
			await updateChannel.mutateAsync({
				workspaceId: channel?.workspace_id || '',
				channelId: channel?.id || '',
				data: {
					description: channelDescription,
				},
			});

			onOpenChange(false);

			await createMessage.mutateAsync({
				workspaceId: channel?.workspace_id || '',
				channelId: channel?.id || '',
				data: {
					content: createDelta(`set the channel description: ${channelDescription}`),
					parent_id: null,
					message_type: 'message_system',
				},
			});
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit description</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					<Textarea
						value={channelDescription}
						onChange={(e) => {
							setChannelDescription(e.target.value);
						}}
					/>
				</DialogDescription>
				<DialogFooter>
					<Button
						variant='outline'
						onClick={() => {
							setChannelDescription(channel?.description || '');
							onOpenChange(false);
						}}
					>
						Cancel
					</Button>
					<Button onClick={handleEditDesSubmit}>Save</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ChannelUpdateDescriptionDialog;
