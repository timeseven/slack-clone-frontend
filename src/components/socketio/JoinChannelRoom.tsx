'use client';

import { useEffect, useRef } from 'react';

import { useSocket } from '@/context/SocketContext';
import useWorkspaceStore from '@/features/workspace/stores/useWorkspaceStore';

const JoinChannelRoom = ({ channelId }: { channelId: string }) => {
	const currentWorkspaceId = useWorkspaceStore((state) => state.currentWorkspaceId);
	const socket = useSocket();
	const hasJoinedRef = useRef(false);

	useEffect(() => {
		if (!channelId || !socket) return;

		const tryJoin = () => {
			if (!hasJoinedRef.current && socket.connected) {
				console.log('✅ join_channel_room', channelId);
				socket.emit('join_channel_room', { channel_id: channelId, workspace_id: currentWorkspaceId });
				hasJoinedRef.current = true;
			}
		};

		if (socket.connected) {
			tryJoin();
		} else {
			socket.once('connect', tryJoin);
		}

		return () => {
			if (hasJoinedRef.current) {
				console.log('❌ leave_channel_room', channelId);
				socket.emit('leave_channel_room', { channel_id: channelId });
			}
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [channelId, socket]);

	return null;
};

export default JoinChannelRoom;
