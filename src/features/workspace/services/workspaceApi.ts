import { fetcher } from '@/lib/fetcher';
import {
	WorkspaceCreate,
	WorkspaceCreateRead,
	WorkspaceJoin,
	WorkspaceMemberRead,
	WorkspaceRead,
	WorkspaceUpdate,
	WorkspaceInvite,
	WorkspaceTransfer,
	WorkspaceSwitch,
	WorkspaceMembershipRoleUpdate,
} from '@/types/workspace';
import { ApiResponse } from '@/types/global';

export const getWorkspaces = async () => {
	return await fetcher<ApiResponse<WorkspaceRead[]>>('/workspaces', { method: 'GET' });
};

export const createWorkspace = async (data: WorkspaceCreate) => {
	return await fetcher<ApiResponse<WorkspaceCreateRead>>('/workspaces', { method: 'POST', body: JSON.stringify(data) });
};

export const getWorkspace = async (workspaceId: string) => {
	return await fetcher<ApiResponse<WorkspaceRead>>(`/workspaces/${workspaceId}`, { method: 'GET' });
};

export const updateWorkspace = async (workspaceId: string, data: WorkspaceUpdate) => {
	return await fetcher<ApiResponse<WorkspaceRead>>(`/workspaces/${workspaceId}`, {
		method: 'PATCH',
		body: JSON.stringify(data),
	});
};

export const deleteWorkspace = async (workspaceId: string) => {
	return await fetcher<ApiResponse<null>>(`/workspaces/${workspaceId}`, { method: 'DELETE' });
};

export const transferWorkspace = async (workspaceId: string, data: WorkspaceTransfer) => {
	return await fetcher<ApiResponse<WorkspaceRead>>(`/workspaces/${workspaceId}/transfer`, {
		method: 'PATCH',
		body: JSON.stringify(data),
	});
};

export const joinWorkspace = async (workspaceId: string, data: WorkspaceJoin) => {
	return await fetcher<ApiResponse<WorkspaceRead>>(`/workspaces/${workspaceId}/join`, {
		method: 'POST',
		body: JSON.stringify(data),
	});
};

export const inviteToWorkspace = async (workspaceId: string, data: WorkspaceInvite) => {
	return await fetcher<ApiResponse<WorkspaceRead>>(`/workspaces/${workspaceId}/invite`, {
		method: 'POST',
		body: JSON.stringify(data),
	});
};

export const switchWorkspace = async (workspaceId: string, data: WorkspaceSwitch) => {
	return await fetcher<ApiResponse<WorkspaceRead>>(`/workspaces/${workspaceId}/switch`, {
		method: 'PATCH',
		body: JSON.stringify(data),
	});
};

export const chooseWorkspace = async (data: WorkspaceSwitch) => {
	return await fetcher<ApiResponse<WorkspaceRead>>(`/workspaces/choose`, {
		method: 'PATCH',
		body: JSON.stringify(data),
	});
};

export const leaveWorkspace = async (workspaceId: string) => {
	return await fetcher<ApiResponse<null>>(`/workspaces/${workspaceId}/leave`, {
		method: 'PATCH',
	});
};

export const removeMemberFromWorkspace = async (workspaceId: string, userId: string) => {
	return await fetcher<ApiResponse<WorkspaceMemberRead>>(`/workspaces/${workspaceId}/remove/${userId}`, {
		method: 'PATCH',
	});
};

export const setWorkspaceRole = async (workspaceId: string, data: WorkspaceMembershipRoleUpdate) => {
	return await fetcher<ApiResponse<WorkspaceRead>>(`/workspaces/${workspaceId}/set-role`, {
		method: 'PATCH',
		body: JSON.stringify(data),
	});
};
