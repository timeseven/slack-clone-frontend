'use client';

import React from 'react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { WorkspaceRead } from '@/types/workspace';
import WorkspaceMemberSearch from '@/features/workspace/components/WorkspaceMemberSearch';

const WorkspaceMemberDialog = ({
	dialogOpen,
	setDialogOpen,
	workspace,
}: {
	dialogOpen: boolean;
	setDialogOpen: (open: boolean) => void;
	workspace?: WorkspaceRead;
}) => {
	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogContent className='p-2'>
				<DialogHeader className='px-5 py-3'>
					<DialogTitle>Workspace Members</DialogTitle>
					<DialogDescription>Configuration of workspace members</DialogDescription>
				</DialogHeader>
				<WorkspaceMemberSearch workspace={workspace} onSuccess={() => setDialogOpen(false)} />
			</DialogContent>
		</Dialog>
	);
};

export default WorkspaceMemberDialog;
