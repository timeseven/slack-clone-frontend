'use client';

import type React from 'react';

import JoinUserRoom from '@/components/socketio/JoinUserRoom';
import WorkspaceNavigateWrapper from '@/components/wrapper/WorkspaceNavigateWrapper';
import SocketEventHandler from '@/components/socketio/SocketEventHandler';

import { AuthProvider } from '@/context/AuthContext';
import { SocketProvider } from '@/context/SocketContext';
import { useIsPublicPath } from '@/hooks/usePublicPath';

const LayoutWorkspaceWrapper = ({ children }: { children: React.ReactNode }) => {
	const isPublic = useIsPublicPath();
	if (isPublic) return <>{children}</>;

	return (
		<AuthProvider>
			<SocketProvider>
				<JoinUserRoom />
				<SocketEventHandler />
				<WorkspaceNavigateWrapper>{children}</WorkspaceNavigateWrapper>
			</SocketProvider>
		</AuthProvider>
	);
};

export default LayoutWorkspaceWrapper;
