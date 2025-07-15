import { queryClient } from '@/context/ReactQueryContext';
import useRouteStore from '@/stores/useRouteStore';
import { ApiResponse } from '@/types/global';
import { WorkspaceReadBase } from '@/types/workspace';
import useWorkspaceStore from '@/features/workspace/stores/useWorkspaceStore';

export const handleWorkspaceUpdate = (data: WorkspaceReadBase) => {
	const { id, name, slug, logo } = data;

	queryClient.setQueryData(['workspace', id], (prev: ApiResponse<WorkspaceReadBase> | undefined) => {
		if (!prev) return prev;

		return {
			...prev,
			data: {
				...prev.data,
				name: name ?? prev.data.name,
				slug: slug ?? prev.data.slug,
				logo: logo === undefined ? prev.data.logo : logo,
			},
		};
	});

	queryClient.setQueryData(['workspaces'], (prev: ApiResponse<WorkspaceReadBase[]> | undefined) => {
		if (!prev) return prev;

		return {
			...prev,
			data: prev.data.map((ws) => {
				if (ws.id === id) {
					return {
						...ws,
						name: name ?? ws.name,
						slug: slug ?? ws.slug,
						logo: logo === undefined ? ws.logo : logo,
					};
				}
				return ws;
			}),
		};
	});
};
export const handleWorkspaceDelete = (data: { workspace_id: string }) => {
	const { workspace_id } = data;
	useRouteStore.getState().resetRoute();
	useWorkspaceStore.getState().resetWorkspace();

	queryClient.setQueryData(['workspaces'], (prev: ApiResponse<WorkspaceReadBase[]> | undefined) => {
		if (!prev) return prev;
		return {
			...prev,
			data: prev.data.filter((ws) => ws.id !== workspace_id),
		};
	});
};

export const handleWorkspaceTransfer = (data: { workspace_id: string }) => {
	const { workspace_id } = data;
	queryClient.invalidateQueries({ queryKey: ['workspace', workspace_id] });
};
