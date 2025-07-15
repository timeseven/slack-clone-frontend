'use client';

import { useEffect, useRef } from 'react';

import { useSocket } from '@/context/SocketContext';
import { useAuthContext } from '@/context/AuthContext';

const JoinUserRoom = () => {
	const { user } = useAuthContext();
	const socket = useSocket();
	const hasJoinedRef = useRef(false);

	// Join user room
	useEffect(() => {
		if (!user || !socket) return;

		const tryJoin = () => {
			if (!hasJoinedRef.current && socket.connected) {
				console.log('✅ join_user_room', user?.id);
				socket.emit('join_user_room', { user_id: user?.id });
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
				console.log('❌ leave_user_room', user?.id);
				socket.emit('leave_user_room', { user_id: user?.id });
			}
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return null;
};

export default JoinUserRoom;
