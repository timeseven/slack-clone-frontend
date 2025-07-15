'use client';

import React, { useState } from 'react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import InviteMemberDialog from '@/features/workspace/components/InviteMemberDialog';
import useWorkspaceStore from '@/features/workspace/stores/useWorkspaceStore';
import AvatarContainer from '@/components/global/AvatarContainer';
import WorkspaceDetailDialog from '@/features/workspace/components/WorkspaceDetailDialog';
import WorkspaceMemberDialog from '@/features/workspace/components/WorkspaceMemberDialog';
import { cn } from '@/lib/utils';

import WorkspaceLeaveDialog from '@/features/workspace/components/WorkspaceLeaveDialog';
import { useGetWorkspace } from '@/features/workspace/hooks/useWorkspaceApiHooks';

const HomeSidebarHeader = () => {
	const currentWorkspaceId = useWorkspaceStore((state) => state.currentWorkspaceId);
	const openInviteWorkspaceMemberDialog = useWorkspaceStore((state) => state.openInviteWorkspaceMemberDialog);
	const setOpenInviteWorkspaceMemberDialog = useWorkspaceStore((state) => state.setOpenInviteWorkspaceMemberDialog);
	const { data: workspace } = useGetWorkspace(currentWorkspaceId!);

	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [workspaceDetailDialogOpen, setWorkspaceDetailDialogOpen] = useState(false);
	const [transferOwnershipDialogOpen, setTransferOwnershipDialogOpen] = useState(false);
	const [openLeaveWorkspaceDialog, setOpenLeaveWorkspaceDialog] = useState(false);

	const handleOpenInviteDialog = () => {
		setDropdownOpen(false); // Close the dropdown first
		setTimeout(() => {
			setOpenInviteWorkspaceMemberDialog(true); // Then open the dialog after a small delay
		}, 10);
	};

	const handleOpenWorkspaceDialog = () => {
		setDropdownOpen(false); // Close the dropdown first
		setTimeout(() => {
			setWorkspaceDetailDialogOpen(true); // Then open the dialog after a small delay
		}, 10);
	};

	const handleOpenTransferOwnershipDialog = () => {
		setDropdownOpen(false); // Close the dropdown first
		setTimeout(() => {
			setTransferOwnershipDialogOpen(true); // Then open the dialog after a small delay
		}, 10);
	};

	const handleOpenLeaveWorkspaceDialog = () => {
		setDropdownOpen(false); // Close the dropdown first
		setTimeout(() => {
			setOpenLeaveWorkspaceDialog(true); // Then open the dialog after a small delay
		}, 10);
	};

	return (
		<div className='flex w-full items-center justify-between'>
			<DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
				<DropdownMenuTrigger asChild>
					<Button variant='ghost' className='hover:bg-primary'>
						<span className='text-xl font-bold text-white'>{workspace?.name}</span>
						<ChevronDown className='text-white' />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent className='min-w-64 rounded-lg' align='start' sideOffset={5}>
					<DropdownMenuItem
						className={cn('cursor-pointer gap-x-3 p-3')}
						onSelect={(e) => {
							e.preventDefault();
							handleOpenWorkspaceDialog();
						}}
						disabled={workspace?.membership?.role === 'member'}
					>
						<AvatarContainer
							src={workspace?.logo}
							alt={workspace?.name || ''}
							name={workspace?.name || 'U'}
							avatarClassName='size-9 rounded-md'
							fallbackClassName='flex size-9 items-center justify-center rounded-md bg-black/70 font-bold text-white'
						/>
						<div className='flex-1 font-bold'>{workspace?.name}</div>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className='cursor-pointer gap-x-3 p-3'
						onSelect={(e) => {
							e.preventDefault();
							handleOpenTransferOwnershipDialog();
						}}
					>
						<div className='font-medium text-black'>Members</div>
					</DropdownMenuItem>
					{(workspace?.membership?.role === 'owner' || workspace?.membership?.role === 'admin') && (
						<>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className='cursor-pointer gap-x-3 p-3'
								onSelect={(e) => {
									e.preventDefault();
									handleOpenInviteDialog();
								}}
							>
								<div className='font-medium text-black'>Invite people to {workspace?.name}</div>
							</DropdownMenuItem>
						</>
					)}
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className={cn('cursor-pointer gap-x-3 p-3', {
							'cursor-not-allowed opacity-50 hover:bg-transparent!': workspace?.membership?.role === 'owner',
						})}
						onSelect={(e) => {
							e.preventDefault();
							if (workspace?.membership?.role === 'owner') return;
							handleOpenLeaveWorkspaceDialog();
						}}
					>
						<div className='text-destructive font-medium'>
							Leave workspace{' '}
							{!!(workspace?.membership?.role === 'owner') && (
								<span className='text-sm text-gray-400'>(Transfer ownership before leaving)</span>
							)}
						</div>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<InviteMemberDialog
				dialogOpen={openInviteWorkspaceMemberDialog}
				setDialogOpen={setOpenInviteWorkspaceMemberDialog}
				workspace={workspace}
			/>
			<WorkspaceDetailDialog
				dialogOpen={workspaceDetailDialogOpen}
				setDialogOpen={setWorkspaceDetailDialogOpen}
				initialData={workspace}
			/>
			<WorkspaceMemberDialog
				dialogOpen={transferOwnershipDialogOpen}
				setDialogOpen={setTransferOwnershipDialogOpen}
				workspace={workspace}
			/>
			<WorkspaceLeaveDialog
				open={openLeaveWorkspaceDialog}
				onOpenChange={setOpenLeaveWorkspaceDialog}
				workspace={workspace}
			/>
		</div>
	);
};

export default HomeSidebarHeader;
