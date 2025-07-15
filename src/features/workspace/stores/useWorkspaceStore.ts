import { create, StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage, devtools, PersistOptions } from 'zustand/middleware';

import { cookieStorage, forcePersist } from '@/lib/utils';

interface WorkspacePersistState {
	currentWorkspaceId: string;
}

interface WorkspaceUIState {
	openInviteWorkspaceMemberDialog: boolean;
}

interface WorkspaceState extends WorkspacePersistState, WorkspaceUIState {}

interface WorkspaceActions {
	setCurrentWorkspaceId: (id: string) => void;
	setOpenInviteWorkspaceMemberDialog: (open: boolean) => void;
	resetWorkspace: () => void;
}

type WorkspaceSlice = WorkspaceState & WorkspaceActions;

const createRouteSlice =
	<T extends WorkspaceSlice>(): StateCreator<T, [['zustand/immer', never]], [], WorkspaceSlice> =>
	(set) => {
		const initialState: WorkspaceState = {
			currentWorkspaceId: '',
			openInviteWorkspaceMemberDialog: false,
		};

		return {
			...initialState,
			setCurrentWorkspaceId: (id) =>
				set((state) => {
					state.currentWorkspaceId = id;
				}),
			setOpenInviteWorkspaceMemberDialog: (open) =>
				set((state) => {
					state.openInviteWorkspaceMemberDialog = open;
				}),
			resetWorkspace: () =>
				set((state) => {
					state.currentWorkspaceId = initialState.currentWorkspaceId;
				}),
		};
	};

const persistOptions: PersistOptions<WorkspaceSlice, WorkspacePersistState> = {
	name: 'workspace-storage',
	storage: createJSONStorage(() => cookieStorage),
	partialize: (state) => ({
		currentWorkspaceId: state.currentWorkspaceId,
	}),
};

const useWorkspaceStore = create<WorkspaceSlice>()(
	devtools(
		persist(
			immer((...a) => ({
				...createRouteSlice<WorkspaceSlice>()(...a),
			})),
			persistOptions
		),
		{ name: 'workspace-devtools' }
	)
);

forcePersist(useWorkspaceStore);

export default useWorkspaceStore;
