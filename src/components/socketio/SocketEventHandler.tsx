'use client';

import { queryClient } from '@/context/ReactQueryContext';
import { useSocketEvent } from '@/context/SocketContext';
import {
	handleChannelCreate,
	handleChannelUpdate,
	handleChannelDelete,
} from '@/features/channel/sockets/handleChannel';
import { handleMessageSend, handleMessageUnread } from '@/features/message/sockets/handleMessage';
import { handleReactionAdd, handleReactionRemove } from '@/features/message/sockets/handleReaction';
import {
	handleWorkspaceDelete,
	handleWorkspaceUpdate,
	handleWorkspaceTransfer,
} from '@/features/workspace/sockets/handleWorkspace';
import { toast } from 'sonner';

const SocketEventHandler = () => {
	// Notify user events
	useSocketEvent('message:unread', (data) => {
		console.log('Handle message unread', data);
		handleMessageUnread(data);
	});
	useSocketEvent('channel:create', (data) => {
		console.log('Handle channel create >>> private, dm, group_dm');
		handleChannelCreate(data);
	}); // public, private, dm, group_dm

	useSocketEvent('mention:create', () => {
		console.log('Handle mention create >>> mention');
	});
	useSocketEvent('channel:role:update', (data) => {
		console.log('Handle channel role update >>> channel');
		queryClient.invalidateQueries({ queryKey: ['channel', data.workspace_id, data.channel_id] });
	});
	useSocketEvent('workspace:remove', (data) => {
		console.log('Handle workspace remove >>> workspace');
		queryClient.invalidateQueries({ queryKey: ['workspace', data.workspace_id] });
		handleWorkspaceDelete(data);
		toast.error("You've been removed from the workspace");
	});

	// Notify workspace events
	useSocketEvent('workspace:update', (data) => {
		console.log('Handle workspace update >>> workspace', data);
		handleWorkspaceUpdate(data);
	});
	useSocketEvent('workspace:delete', (data) => {
		console.log('Handle workspace delete >>> workspace');
		handleWorkspaceDelete(data);
	});
	useSocketEvent('workspace:transfer', (data) => {
		console.log('Handle workspace transfer >>> workspace');
		handleWorkspaceTransfer(data);
	});
	useSocketEvent('workspace:join', (data) => {
		console.log('Handle workspace join >>> workspace');
		queryClient.invalidateQueries({ queryKey: ['workspace', data.workspace_id] });
	});
	useSocketEvent('workspace:leave', (data) => {
		console.log('Handle workspace leave >>> workspace');
		queryClient.invalidateQueries({ queryKey: ['workspace', data.workspace_id] });
	});
	useSocketEvent('workspace:role:update', (data) => {
		console.log('Handle workspace role update >>> workspace');
		queryClient.invalidateQueries({ queryKey: ['workspace', data.workspace_id] });
	});

	// Notify channel events
	useSocketEvent('channel:update', (data) => {
		console.log('Handle channel update >>> channel');
		handleChannelUpdate(data);
	});
	useSocketEvent('channel:delete', (data) => {
		console.log('Handle channel delete >>> channel');
		handleChannelDelete(data);
	});
	useSocketEvent('channel:transfer', (data) => {
		console.log('Handle channel transfer >>> channel');
		queryClient.invalidateQueries({ queryKey: ['channel', data.workspace_id, data.channel_id] });
	});
	useSocketEvent('channel:join', (data) => {
		console.log('Handle channel join >>> channel');
		queryClient.invalidateQueries({ queryKey: ['channel', data.workspace_id, data.channel_id] });
	});
	useSocketEvent('channel:leave', (data) => {
		console.log('Handle channel leave >>> channel');
		queryClient.invalidateQueries({ queryKey: ['channel', data.workspace_id, data.channel_id] });
	});
	useSocketEvent('message:create', (data) => {
		console.log('Handle message create >>> message');
		handleMessageSend(data);
	});
	useSocketEvent('message:update', () => {
		console.log('Handle message update >>> message');
	});
	useSocketEvent('message:delete', () => {
		console.log('Handle message delete >>> message');
	});
	useSocketEvent('reaction:create', (data) => {
		console.log('Handle reaction create >>> reaction');
		handleReactionAdd(data);
	});
	useSocketEvent('reaction:delete', (data) => {
		console.log('Handle reaction delete >>> reaction');
		handleReactionRemove(data);
	});

	return null;
};

export default SocketEventHandler;
