'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { WorkspaceRead } from '@/types/workspace';
import WorkspaceDetailDialog from '@/features/workspace/components/WorkspaceDetailDialog';
import useWorkspaceStore from '@/features/workspace/stores/useWorkspaceStore';
import useRouteStore from '@/stores/useRouteStore';
import AvatarContainer from '@/components/global/AvatarContainer';
import {
	useChooseWorkspace,
	useGetWorkspaces,
	useSwitchWorkspace,
} from '@/features/workspace/hooks/useWorkspaceApiHooks';

const WorkspacePage = () => {
	const { resetRoute } = useRouteStore();
	const { setCurrentWorkspaceId, currentWorkspaceId } = useWorkspaceStore();

	const { data: workspaces, isLoading } = useGetWorkspaces();
	const switchWorkspace = useSwitchWorkspace();
	const chooseWorkspace = useChooseWorkspace();

	const [sortedWorkspaces, setSortedWorkspaces] = useState<WorkspaceRead[]>([]);
	const [dialogOpen, setDialogOpen] = useState(false);

	const handleEnterWorkspace = async (workspace: WorkspaceRead) => {
		if (!workspace?.membership?.is_active) {
			const activeWorkspace = workspaces?.find((w) => w.membership.is_active);
			try {
				if (activeWorkspace) {
					await switchWorkspace.mutateAsync({
						workspaceId: activeWorkspace?.id,
						data: { workspace_id: workspace.id },
					});
				} else {
					await chooseWorkspace.mutateAsync({
						data: { workspace_id: workspace.id },
					});
				}
				resetRoute();
				setCurrentWorkspaceId(workspace.id);
			} catch (error) {
				console.error('Failed to switch workspace:', error);
			}
		} else {
			setCurrentWorkspaceId(workspace.id);
		}
	};

	useEffect(() => {
		if (workspaces) {
			const sorted = [...workspaces].sort((a, b) => {
				if (a.membership.is_active && !b.membership.is_active) return -1;
				if (!a.membership.is_active && b.membership.is_active) return 1;
				return a.name.localeCompare(b.name);
			});
			setSortedWorkspaces(sorted);
		}
	}, [workspaces]);

	if (isLoading || currentWorkspaceId) return null;

	return (
		<div className='bg-background flex min-h-screen items-center justify-center p-4'>
			<Card className='w-full max-w-2xl border-0 shadow-xl'>
				<CardHeader>
					<h2 className='text-center text-2xl font-bold text-gray-900'>Choose a Workspace</h2>
					<p className='text-center text-sm text-gray-600'>Switch to an existing workspace or create a new one.</p>
				</CardHeader>
				<CardContent className='h-[400px] overflow-auto pr-2'>
					{sortedWorkspaces.length > 0 ? (
						<div className='flex flex-col gap-y-3'>
							{sortedWorkspaces.map((workspace) => (
								<Card key={workspace.id} className='border-border border p-4 transition-shadow hover:shadow-md'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center gap-x-3'>
											<AvatarContainer
												src={workspace?.logo}
												alt={workspace?.name || ''}
												name={workspace?.name}
												avatarClassName='size-10 rounded-md'
												fallbackClassName='bg-muted text-black'
											/>
											<div>
												<p className='font-semibold text-gray-900'>{workspace.name}</p>
												{workspace?.membership?.is_active && <p className='text-sm text-gray-500'>(Current)</p>}
											</div>
										</div>
										<Button
											onClick={() => handleEnterWorkspace(workspace)}
											className='bg-primary text-white hover:bg-[#3d1142]'
										>
											Enter
										</Button>
									</div>
								</Card>
							))}
						</div>
					) : (
						<div className='flex h-full flex-col items-center justify-center space-y-2 text-center'>
							<p className='text-lg font-medium text-gray-700'>No workspaces found</p>
							<p className='text-muted-foreground text-sm'>Click below to create your first workspace</p>
						</div>
					)}
				</CardContent>
				<CardFooter>
					<Button className='bg-primary w-full text-white hover:bg-[#3d1142]' onClick={() => setDialogOpen(true)}>
						<Plus className='mr-2 h-4 w-4' />
						Create New Workspace
					</Button>
				</CardFooter>
			</Card>
			<WorkspaceDetailDialog dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
		</div>
	);
};

export default WorkspacePage;
