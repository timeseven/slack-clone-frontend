'use client';

import { memo, useCallback } from 'react';

import { cn } from '@/lib/utils';
import { MenuKey } from '@/types/layout';
import { Button } from '@/components/ui/button';

import WorkspaceSwitcher from '@/features/workspace/components/WorkspaceSwitcher';
import useRouteStore from '@/stores/useRouteStore';
import useWorkspaceStore from '@/features/workspace/stores/useWorkspaceStore';
import UserButton from '@/features/user/components/UserButton';
import { useAuthContext } from '@/context/AuthContext';
import { menuList } from '@/consts/layout';
import { useGetWorkspace, useGetWorkspaces } from '@/features/workspace/hooks/useWorkspaceApiHooks';

const MainSidebar = () => {
	const currentMenu = useRouteStore((state) => state.currentMenu);
	const setCurrentMenu = useRouteStore((state) => state.setCurrentMenu);
	const currentWorkspaceId = useWorkspaceStore((state) => state.currentWorkspaceId);
	const { data: workspaces } = useGetWorkspaces();
	const { data: workspace } = useGetWorkspace(currentWorkspaceId!);
	const { user } = useAuthContext();

	const handleMenuNavigate = useCallback(
		(menu: MenuKey) => {
			setCurrentMenu(menu);
		},
		[setCurrentMenu]
	);

	return (
		<div className='bg-primary flex max-w-[60px] min-w-[60px] flex-col items-center justify-between pb-4'>
			<div className='flex flex-col items-center gap-y-4'>
				<WorkspaceSwitcher currentWorkspace={workspace} workspaces={workspaces} side='right' />
				{menuList.map((item) => (
					<div key={item.name} className='flex flex-col items-center'>
						<Button
							variant='ghost'
							className={cn('hover:bg-muted/30 h-11 w-11', {
								'bg-muted/30': currentMenu === item.name,
							})}
							onClick={() => handleMenuNavigate(item.name)}
						>
							<item.icon className='text-muted size-6' />
						</Button>
						<span className='text-muted text-xs font-semibold'>{item.name}</span>
					</div>
				))}
			</div>
			<UserButton user={user} />
		</div>
	);
};

export default memo(MainSidebar);
