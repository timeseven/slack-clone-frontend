'use client';

import { useState } from 'react';

import { Plus } from 'lucide-react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import AvatarContainer from '@/components/global/AvatarContainer';

import { cn } from '@/lib/utils';
import { WorkspaceRead } from '@/types/workspace';
import useRouteStore from '@/stores/useRouteStore';
import useWorkspaceStore from '@/features/workspace/stores/useWorkspaceStore';
import WorkspaceDetailDialog from '@/features/workspace/components/WorkspaceDetailDialog';
import { useSwitchWorkspace } from '@/features/workspace/hooks/useWorkspaceApiHooks';

const WorkspaceSwitcher = ({
	currentWorkspace,
	workspaces,
	className,
	side,
}: {
	currentWorkspace: WorkspaceRead | undefined;
	workspaces: WorkspaceRead[] | undefined;
	className?: string;
	side?: 'left' | 'right' | 'top' | 'bottom';
}) => {
	const { resetRoute } = useRouteStore();
	const { setCurrentWorkspaceId } = useWorkspaceStore();

	const switchWorkspace = useSwitchWorkspace();

	const [dialogOpen, setDialogOpen] = useState(false);
	const [switchDialogOpen, setSwitchDialogOpen] = useState(false);
	const [targetWorkspace, setTargetWorkspace] = useState<WorkspaceRead | null>(null);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const handleOpenDialog = () => {
		setDropdownOpen(false); // Close the dropdown first
		setTimeout(() => {
			setDialogOpen(true); // Then open the dialog after a small delay
		}, 10);
	};

	const handleOpenSwitchDialog = () => {
		setDropdownOpen(false); // Close the dropdown first
		setTimeout(() => {
			setSwitchDialogOpen(true); // Then open the dialog after a small delay
		}, 10);
	};

	const handleSwitchWorkspace = async () => {
		try {
			// Call switchWorkspace mutation with current and target workspace IDs
			await switchWorkspace.mutateAsync({
				workspaceId: currentWorkspace?.id || '',
				data: { workspace_id: targetWorkspace?.id || '' },
			});

			resetRoute();
			setCurrentWorkspaceId(targetWorkspace?.id || '');
			setTargetWorkspace(null);
		} catch (error) {
			// Optionally handle error here, e.g. toast.error or console.error
			console.error('Failed to switch workspace:', error);
		}
	};

	return (
		<>
			<DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
				<DropdownMenuTrigger asChild>
					<Button size='icon' className={cn('data-[state=open]:bg-accent/30 relative h-11 w-11 text-black', className)}>
						<AvatarContainer
							src={currentWorkspace?.logo}
							alt={currentWorkspace?.name || ''}
							name={currentWorkspace?.name}
							avatarClassName='m-auto size-8 rounded-md'
							fallbackClassName='bg-accent text-black'
						/>
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent
					className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
					align='start'
					side={side}
					sideOffset={5}
				>
					<DropdownMenuLabel className='text-muted-foreground text-xs'>Workspaces</DropdownMenuLabel>
					{workspaces &&
						workspaces.length > 0 &&
						workspaces
							.sort((a) => (a.id === currentWorkspace?.id ? -1 : 1))
							.map((workspace) => (
								<DropdownMenuItem
									key={workspace.name}
									onClick={async () => {
										setTargetWorkspace(workspace);
										handleOpenSwitchDialog();
									}}
									className='cursor-pointer gap-2 p-2'
									disabled={workspace.id === currentWorkspace?.id}
								>
									<AvatarContainer
										src={workspace?.logo}
										alt={workspace?.name || ''}
										name={workspace?.name}
										avatarClassName='size-8 rounded-md'
										fallbackClassName='bg-accent text-black'
									/>
									{workspace.name}
									{currentWorkspace?.id === workspace.id && '(Current)'}
								</DropdownMenuItem>
							))}
					<DropdownMenuSeparator />

					<DropdownMenuItem
						onSelect={(e) => {
							e.preventDefault();
							handleOpenDialog();
						}}
						className='cursor-pointer gap-2 p-2'
					>
						<Plus className='h-4 w-4 rounded-sm' />
						New Workspace
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<WorkspaceDetailDialog dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
			<AlertDialog open={switchDialogOpen} onOpenChange={setSwitchDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Switch Workspace</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to switch to <b>{targetWorkspace?.name}</b>?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleSwitchWorkspace}>Switch</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default WorkspaceSwitcher;
