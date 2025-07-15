'use client';

import React from 'react';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogFooter,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { WorkspaceRead } from '@/types/workspace';
import { useLeaveWorkspace } from '@/features/workspace/hooks/useWorkspaceApiHooks';
import useRouteStore from '@/stores/useRouteStore';
import useWorkspaceStore from '../stores/useWorkspaceStore';
import { queryClient } from '@/context/ReactQueryContext';

const WorkspaceLeaveDialog = ({
	open,
	onOpenChange,
	workspace,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	workspace?: WorkspaceRead;
}) => {
	const { resetRoute } = useRouteStore();
	const { resetWorkspace } = useWorkspaceStore();
	const leaveWorkspace = useLeaveWorkspace();

	const handleLeaveWorkspace = async () => {
		try {
			await leaveWorkspace.mutateAsync(workspace?.id || '');
			resetRoute();
			resetWorkspace();
			queryClient.invalidateQueries({ queryKey: ['workspaces'] });
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Leave {workspace?.name}</DialogTitle>
					<DialogDescription>
						Are you sure you want to leave the workspace? This action is irreversible.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant='outline' onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button variant='destructive' onClick={handleLeaveWorkspace}>
						Leave
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default WorkspaceLeaveDialog;
