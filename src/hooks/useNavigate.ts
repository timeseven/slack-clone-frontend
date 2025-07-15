'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { MenuKey } from '@/types/layout';
import useRouteStore from '@/stores/useRouteStore';

const getDefaultRoute = (menu: MenuKey, workspaceId: string) => {
	switch (menu) {
		case 'Home':
			return `/workspace/${workspaceId}`;
		case 'DMs':
			return `/workspace/${workspaceId}/dms`;
		case 'Activity':
			return `/workspace/${workspaceId}/activity`;
		default:
			return `/workspace/${workspaceId}`;
	}
};

export const useNavigate = () => {
	const navigate = useRouter();

	const setCurrentMenu = useRouteStore((state) => state.setCurrentMenu);
	const routeMap = useRouteStore((state) => state.routeMap);
	const setRouteMap = useRouteStore((state) => state.setRouteMap);

	const navigateRoute = useCallback(
		({ menu, workspaceId, route }: { menu: MenuKey; workspaceId?: string; route?: string }) => {
			if (!workspaceId) return;

			setCurrentMenu(menu);
			const savedRoute = routeMap[menu];
			const fallbackRoute = getDefaultRoute(menu, workspaceId);
			let targetRoute = '';
			if (route && route.includes(workspaceId)) {
				targetRoute = route;
			} else if (savedRoute && savedRoute.includes(workspaceId)) {
				targetRoute = savedRoute;
			} else {
				targetRoute = fallbackRoute;
			}
			setRouteMap(menu, targetRoute);
			navigate.push(targetRoute);
		},
		[routeMap, setCurrentMenu, setRouteMap, navigate]
	);

	return { navigateRoute };
};
