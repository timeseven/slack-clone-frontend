import { UserBaseRead } from './user';

export type MessageType = 'message_user' | 'message_system' | 'changelog' | 'notes';
export interface ReactionCreate {
	emoji: string;
}

export interface MentionCreate {
	start_index: number;
	end_index: number;
	mention_text: string;
}

export interface MessageCreate {
	content: string;
	parent_id?: string | null;
	message_type?: MessageType;
}

export interface ReactionRead {
	id: string;
	emoji: string;
	sender_id: string;
}

export interface MentionRead {
	id: string;
	start_index: number;
	end_index: number;
	mention_text: string;
}

export interface MessageReadBase {
	id: string;
	content: string;
	is_pinned: boolean;
	sender: UserBaseRead;
	workspace_id: string;
	channel_id: string;
	message_type: string;
	reactions?: ReactionRead[];
	mentions?: MentionRead[];
	created_at: string;
	updated_at: string;
}

export interface MessageRead extends MessageReadBase {
	parent_id?: string | null;
	replies: MessageReadBase[];
}

export interface MessagePagination {
	before?: string;
	after?: string;
	limit?: number;
}
