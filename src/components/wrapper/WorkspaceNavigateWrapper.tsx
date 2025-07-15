'use client';

import React, { useEffect } from 'react';

import { useNavigate } from '@/hooks/useNavigate';
import useRouteStore from '@/stores/useRouteStore';
import useWorkspaceStore from '@/features/workspace/stores/useWorkspaceStore';
import { redirect, useParams } from 'next/navigation';

const WorkspaceNavigateWrapper = ({ children }: { children: React.ReactNode }) => {
	const params = useParams();
	const { navigateRoute } = useNavigate();
	const currentWorkspaceId = useWorkspaceStore((state) => state.currentWorkspaceId);
	const currentMenu = useRouteStore((state) => state.currentMenu);
	const routeMap = useRouteStore((state) => state.routeMap);

	useEffect(() => {
		const { workspaceId } = params;
		if (!currentWorkspaceId) {
			if (workspaceId) {
				redirect('/workspace');
			}
			return;
		}

		const menu = currentMenu || 'Home';
		const path = routeMap[menu] || '';

		navigateRoute({ menu, workspaceId: currentWorkspaceId, route: path });

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentMenu, routeMap, currentWorkspaceId, navigateRoute]);

	return <div className='h-full w-full'>{children}</div>;
};

export default WorkspaceNavigateWrapper;
