import { create, StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage, devtools, PersistOptions } from 'zustand/middleware';

import { MenuKey } from '@/types/layout';
import { cookieStorage, forcePersist } from '@/lib/utils';

interface RouteState {
	currentMenu: MenuKey;
	routeMap: Record<MenuKey, string>;
	dmRouteMap: Record<MenuKey, string>;
}

interface RouteActions {
	setCurrentMenu: (menu: MenuKey) => void;
	setRouteMap: (menu: MenuKey, route: string) => void;
	setDmRouteMap: (menu: MenuKey, route: string) => void;
	resetRoute: () => void;
}

type RouteSlice = RouteState & RouteActions;

const createRouteSlice =
	<T extends RouteSlice>(): StateCreator<T, [['zustand/immer', never]], [], RouteSlice> =>
	(set) => {
		const initialState: RouteState = {
			currentMenu: 'Home' as MenuKey,
			routeMap: {
				Home: '',
				DMs: '',
				Activity: '',
			},
			dmRouteMap: {
				Home: '',
				DMs: '',
				Activity: '',
			},
		};

		return {
			...initialState,
			setCurrentMenu: (menu) =>
				set((state) => {
					state.currentMenu = menu;
				}),
			setRouteMap: (menu, route) =>
				set((state) => {
					state.routeMap[menu] = route;
				}),
			setDmRouteMap: (menu, route) =>
				set((state) => {
					state.dmRouteMap[menu] = route;
				}),
			resetRoute: () =>
				set((state) => {
					state.currentMenu = initialState.currentMenu;
					state.routeMap = initialState.routeMap;
					state.dmRouteMap = initialState.dmRouteMap;
				}),
		};
	};

const persistOptions: PersistOptions<RouteSlice, RouteState> = {
	name: 'route-storage',
	storage: createJSONStorage(() => cookieStorage),
	partialize: (state) => ({
		currentMenu: state.currentMenu,
		routeMap: state.routeMap,
		dmRouteMap: state.dmRouteMap,
	}),
};

const useRouteStore = create<RouteSlice>()(
	devtools(
		persist(
			immer((...a) => ({
				...createRouteSlice<RouteSlice>()(...a),
			})),
			persistOptions
		),
		{ name: 'route-devtools' }
	)
);

// Manually trigger
forcePersist(useRouteStore);

export default useRouteStore;
