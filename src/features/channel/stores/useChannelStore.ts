import { create, StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';

interface ChannelState {
	openUpdateChannelDialog: boolean;
	updateChannelTab: 'about' | 'members' | 'settings';
}

interface ChannelActions {
	setOpenUpdateChannelDialog: (open: boolean) => void;
	setUpdateChannelTab: (tab: 'about' | 'members' | 'settings') => void;
}

type ChannelSlice = ChannelState & ChannelActions;

export const createChannelSlice: StateCreator<ChannelSlice, [['zustand/immer', never]], [], ChannelSlice> = (set) => ({
	openUpdateChannelDialog: false,
	updateChannelTab: 'about',
	setOpenUpdateChannelDialog: (open) =>
		set((state) => {
			state.openUpdateChannelDialog = open;
		}),
	setUpdateChannelTab: (tab) =>
		set((state) => {
			state.updateChannelTab = tab;
		}),
});

const useChannelStore = create<ChannelSlice>()(
	devtools(
		immer((...a) => ({
			...createChannelSlice(...a),
		})),

		{ name: 'channel-devtools' }
	)
);

export default useChannelStore;
