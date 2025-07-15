'use client';

import { useEffect, useRef } from 'react';

import { useSocket } from '@/context/SocketContext';
import useWorkspaceStore from '@/features/workspace/stores/useWorkspaceStore';

const JoinWorkspaceRoom = () => {
	const currentWorkspaceId = useWorkspaceStore((state) => state.currentWorkspaceId);
	const socket = useSocket();
	const hasJoinedRef = useRef(false);
	useEffect(() => {
		if (!currentWorkspaceId || !socket) return;

		const tryJoin = () => {
			if (!hasJoinedRef.current && socket.connected) {
				console.log('✅ join_workspace_room', currentWorkspaceId);
				socket.emit('join_workspace_room', { workspace_id: currentWorkspaceId });
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
				console.log('❌ leave_workspace_room', currentWorkspaceId);
				socket.emit('leave_workspace_room', { workspace_id: currentWorkspaceId });
			}
		};
	}, [currentWorkspaceId, socket]);

	return null;
};

export default JoinWorkspaceRoom;
