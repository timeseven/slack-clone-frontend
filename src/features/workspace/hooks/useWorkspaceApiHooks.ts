import { useQuery, useMutation } from '@tanstack/react-query';
import {
	WorkspaceRead,
	WorkspaceCreate,
	WorkspaceUpdate,
	WorkspaceSwitch,
	WorkspaceInvite,
	WorkspaceJoin,
	WorkspaceMembershipRoleUpdate,
} from '@/types/workspace';
import {
	getWorkspaces,
	getWorkspace,
	createWorkspace,
	updateWorkspace,
	deleteWorkspace,
	chooseWorkspace,
	switchWorkspace,
	transferWorkspace,
	inviteToWorkspace,
	joinWorkspace,
	leaveWorkspace,
	removeMemberFromWorkspace,
	setWorkspaceRole,
} from '@/features/workspace/services/workspaceApi';

export const useGetWorkspaces = (options = {}) => {
	return useQuery({
		queryKey: ['workspaces'],
		queryFn: getWorkspaces,
		select: (response: { data: WorkspaceRead[] }) => response.data,
		enabled: true,
		...options,
	});
};

export const useGetWorkspace = (workspaceId: string, options = {}) => {
	return useQuery({
		queryKey: ['workspace', workspaceId],
		queryFn: () => getWorkspace(workspaceId),
		select: (response: { data: WorkspaceRead }) => response.data,
		enabled: !!workspaceId,
		...options,
	});
};

export const useCreateWorkspace = () => {
	return useMutation({
		mutationFn: (data: WorkspaceCreate) => createWorkspace(data),
	});
};

export const useUpdateWorkspace = () => {
	return useMutation({
		mutationFn: ({ workspaceId, data }: { workspaceId: string; data: WorkspaceUpdate }) =>
			updateWorkspace(workspaceId, data),
	});
};

export const useDeleteWorkspace = () => {
	return useMutation({
		mutationFn: (workspaceId: string) => deleteWorkspace(workspaceId),
	});
};

export const useChooseWorkspace = () => {
	return useMutation({
		mutationFn: ({ data }: { data: WorkspaceSwitch }) => chooseWorkspace(data),
	});
};

export const useSwitchWorkspace = () => {
	return useMutation({
		mutationFn: ({ workspaceId, data }: { workspaceId: string; data: WorkspaceSwitch }) =>
			switchWorkspace(workspaceId, data),
	});
};

export const useTransferWorkspace = () => {
	return useMutation({
		mutationFn: ({ workspaceId, userId }: { workspaceId: string; userId: string }) =>
			transferWorkspace(workspaceId, { user_id: userId }),
	});
};

export const useInviteToWorkspace = () => {
	return useMutation({
		mutationFn: ({ workspaceId, data }: { workspaceId: string; data: WorkspaceInvite }) =>
			inviteToWorkspace(workspaceId, data),
	});
};

export const useJoinWorkspace = () => {
	return useMutation({
		mutationFn: ({ workspaceId, data }: { workspaceId: string; data: WorkspaceJoin }) =>
			joinWorkspace(workspaceId, data),
	});
};

export const useLeaveWorkspace = () => {
	return useMutation({
		mutationFn: (workspaceId: string) => leaveWorkspace(workspaceId),
	});
};

export const useRemoveMemberFromWorkspace = () => {
	return useMutation({
		mutationFn: ({ workspaceId, userId }: { workspaceId: string; userId: string }) =>
			removeMemberFromWorkspace(workspaceId, userId),
	});
};

export const useSetWorkspaceRole = () => {
	return useMutation({
		mutationFn: ({ workspaceId, data }: { workspaceId: string; data: WorkspaceMembershipRoleUpdate }) =>
			setWorkspaceRole(workspaceId, data),
	});
};
