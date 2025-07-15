'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthContext } from '@/context/AuthContext';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SocketHandler = (data: any) => void;

interface SocketContextValue {
	socket: Socket;
}

const SocketContext = createContext<SocketContextValue | null>(null);

let socket: Socket | null = null;

const getSocket = (userId?: string): Socket => {
	if (!socket) {
		socket = io('http://localhost:8000', {
			withCredentials: true,
			transports: ['websocket'],
			auth: {
				user_id: userId,
			},
		});
	}
	return socket;
};

export function SocketProvider({ children }: { children: ReactNode }) {
	const { user } = useAuthContext();
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		const s = getSocket(user?.id);
		setSocket(s);

		s.on('connect', () => {
			console.log('✅ WebSocket connected:', s.id);
		});

		s.on('disconnect', (reason) => {
			console.warn('⚠️ WebSocket disconnected:', reason);
		});

		return () => {
			s.disconnect();
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!socket) return null;

	return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
}

export function useSocket(): Socket {
	const context = useContext(SocketContext);
	if (!context) throw new Error('useSocket must be used inside <SocketProvider>');
	return context.socket;
}

export function useSocketEvent(event: string, handler: SocketHandler) {
	const socket = useSocket();

	useEffect(() => {
		socket.on(event, handler);

		return () => {
			socket.off(event, handler);
		};
	}, [socket, event, handler]);
}
