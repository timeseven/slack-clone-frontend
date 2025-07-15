import { UserBaseRead } from '@/types/user';
import type { LucideIcon } from 'lucide-react';

export type ChannelType = 'channel' | 'dm' | 'group_dm';
export type ChannelMemberRole = 'owner' | 'admin' | 'member';

export interface ChannelCreate {
	name: string;
	description?: string;
	type?: ChannelType;
	template?: string;
	is_private?: boolean;
}

export interface ChannelUpdate {
	description?: string;
	is_private?: boolean;
}

export interface ChannelTransfer {
	user_id: string;
}

export interface ChannelUpdateRole {
	user_id: string;
	role: ChannelMemberRole;
}

export interface ChannelMembershipCreate {
	role: ChannelMemberRole;
}

export interface ChannelMembershipUpdate {
	role?: ChannelMemberRole;
	is_starred?: boolean;
	is_muted?: boolean;
}

export interface ChannelMembershipUserRead {
	role: ChannelMemberRole;
	is_starred: boolean;
	is_muted: boolean;
	created_at: string;
	unread_count: number;
	last_read_at: string;
}

export interface ChannelReadBase {
	id: string;
	workspace_id: string;
	name: string;
	description?: string;
	type: ChannelType;
	is_private: boolean;
	created_at: string;
}

export interface ChannelRead extends ChannelReadBase {
	membership?: ChannelMembershipUserRead;
	members?: ChannelMemberRead[];
}

export interface ChannelCreateRead {
	channel_id: string;
}

export interface ChannelMemberRead extends UserBaseRead {
	role: ChannelMemberRole;
	is_starred: boolean;
	is_muted: boolean;
	created_at: string;
}

export interface ChannelTabProps {
	name: string;
	count?: number;
	icon: LucideIcon;
}
