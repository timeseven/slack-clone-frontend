import { create, StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { MessageRead, MessageReadBase } from '@/types/message';

interface MessageState {
	messageMap: Record<string, MessageRead | MessageReadBase>;
}

interface MessageActions {
	setMessage: (message: MessageRead | MessageReadBase) => void;
	getMessageById: (id: string) => MessageRead | MessageReadBase | undefined;
}

type MessageSlice = MessageState & MessageActions;

export const createMessageSlice: StateCreator<MessageSlice, [['zustand/immer', never]], [], MessageSlice> = (
	set,
	get
) => ({
	messageMap: {},
	setMessage: (message) =>
		set((state) => ({
			messageMap: {
				...state.messageMap,
				[message.id]: message,
			},
		})),
	getMessageById: (id) => get().messageMap[id],
});

const useMessageStore = create<MessageSlice>()(
	devtools(
		immer((...a) => ({
			...createMessageSlice(...a),
		})),

		{ name: 'message-devtools' }
	)
);

export default useMessageStore;
