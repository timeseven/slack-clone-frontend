import { create, StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage, devtools, PersistOptions } from 'zustand/middleware';

import { cookieStorage, forcePersist } from '@/lib/utils';
import { MenuKey, RightSidebarType } from '@/types/layout';
import { DEFAULT_LEFT_SIZE, DEFAULT_RIGHT_SIZE } from '@/consts/layout';

export interface LayoutState {
	leftSidebarOpenMap: Record<MenuKey, boolean>;
	rightSidebarOpenMap: Record<MenuKey, boolean>;
	rightSidebarTypeMap: Record<MenuKey, RightSidebarType>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	rightSidebarDataMap: Record<MenuKey, any>;
	leftSize: number;
	rightSize: number;
}

interface LayoutActions {
	setLeftSidebarOpenMap: (menu: MenuKey, open: boolean) => void;
	setRightSidebarOpenMap: (menu: MenuKey, open: boolean) => void;
	setRightSidebarTypeMap: (menu: MenuKey, type: RightSidebarType) => void;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	setRightSidebarDataMap: (menu: MenuKey, data: any) => void;
	setLeftSize: (size: number) => void;
	setRightSize: (size: number) => void;
	resetLayout: () => void;
}

type LayoutSlice = LayoutState & LayoutActions;

const createSidebarSlice =
	<T extends LayoutSlice>(): StateCreator<T, [['zustand/immer', never]], [], LayoutSlice> =>
	(set) => {
		const initialState: LayoutState = {
			leftSidebarOpenMap: {
				Home: true,
				DMs: true,
				Activity: true,
			},
			rightSidebarOpenMap: {
				Home: false,
				DMs: false,
				Activity: false,
			},
			rightSidebarTypeMap: {
				Home: 'Reply',
				DMs: 'Reply',
				Activity: 'Reply',
			},
			rightSidebarDataMap: {
				Home: {},
				DMs: {},
				Activity: {},
			},
			leftSize: DEFAULT_LEFT_SIZE,
			rightSize: DEFAULT_RIGHT_SIZE,
		};

		return {
			...initialState,
			setLeftSidebarOpenMap: (menu, open) =>
				set((state) => {
					state.leftSidebarOpenMap[menu] = open;
				}),
			setRightSidebarOpenMap: (menu, open) =>
				set((state) => {
					state.rightSidebarOpenMap[menu] = open;
				}),
			setRightSidebarTypeMap: (menu, type) =>
				set((state) => {
					state.rightSidebarTypeMap[menu] = type;
				}),
			setRightSidebarDataMap: (menu, data) =>
				set((state) => {
					state.rightSidebarDataMap[menu] = data;
				}),
			setLeftSize: (size) =>
				set((state) => {
					state.leftSize = size;
				}),
			setRightSize: (size) =>
				set((state) => {
					state.rightSize = size;
				}),
			resetLayout: () =>
				set((state) => {
					state.leftSidebarOpenMap = initialState.leftSidebarOpenMap;
					state.rightSidebarOpenMap = initialState.rightSidebarOpenMap;
					state.rightSidebarTypeMap = initialState.rightSidebarTypeMap;
					state.rightSidebarDataMap = initialState.rightSidebarDataMap;
					state.leftSize = initialState.leftSize;
					state.rightSize = initialState.rightSize;
				}),
		};
	};

const persistOptions: PersistOptions<LayoutSlice, LayoutState> = {
	name: 'layout-storage',
	storage: createJSONStorage(() => cookieStorage),
	partialize: (state) => ({
		leftSize: state.leftSize,
		rightSize: state.rightSize,
		leftSidebarOpenMap: state.leftSidebarOpenMap,
		rightSidebarOpenMap: state.rightSidebarOpenMap,
		rightSidebarTypeMap: state.rightSidebarTypeMap,
		rightSidebarDataMap: state.rightSidebarDataMap,
	}),
};

const useLayoutStore = create<LayoutSlice>()(
	devtools(
		persist(
			immer((...a) => ({
				...createSidebarSlice<LayoutSlice>()(...a),
			})),
			persistOptions
		),
		{ name: 'layout-devtools' }
	)
);

// Manually trigger
forcePersist(useLayoutStore);

export default useLayoutStore;
