import type { ReactNode } from 'react';
import { UserBaseRead } from '@/types/user';
import type { LucideIcon } from 'lucide-react';
export type WorkspaceMemberRole = 'owner' | 'admin' | 'member';

export interface WorkspaceCreate {
	name: string;
	logo?: File | null;
}

export interface WorkspaceCreateRead {
	workspace_id: string;
}

export interface WorkspaceReadBase {
	id: string;
	name: string;
	slug: string;
	logo?: string | null;
}

export interface WorkspaceUpdate {
	name?: string;
	logo?: File | null;
}

export interface WorkspaceInvite {
	emails: string[];
}

export interface WorkspaceTransfer {
	user_id: string;
}

export interface WorkspaceSwitch {
	workspace_id: string;
}

export interface WorkspaceMembershipRoleUpdate {
	user_id: string;
	role: WorkspaceMemberRole;
}
export interface WorkspaceJoin {
	token?: string | null;
	email?: string | null;
	user_data?: {
		full_name: string;
		password: string;
	} | null;
}
export interface WorkspaceMemberRead extends UserBaseRead {
	role: WorkspaceMemberRole | null;
}

export interface HomeCollapsibleItemProps {
	id: string;
	label: string;
	type: string;
	badge?: number;
	path?: string;
	icon?: LucideIcon | string | string[];
	extra?: ReactNode;
	children?: HomeCollapsibleItemProps[];
	open?: boolean;
	setOpen?: (open: boolean) => void;
	selectedPath?: string;
	onSelect?: (path: string) => void;
}

export interface WorkspaceRead {
	id: string;
	name: string;
	slug: string;
	logo?: string | null;
	membership: {
		role: WorkspaceMemberRole;
		is_active: boolean;
		created_at: Date;
	};
	members?: WorkspaceMemberRead[];
}
