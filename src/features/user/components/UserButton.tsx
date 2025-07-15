'use client';

import React from 'react';

import { useRouter } from 'next/navigation';
import { BadgeCheck, LogOut } from 'lucide-react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import AvatarContainer from '@/components/global/AvatarContainer';

import { cn } from '@/lib/utils';
import { UserRead } from '@/types/user';
import useRouteStore from '@/stores/useRouteStore';
import useLayoutStore from '@/stores/useLayoutStore';
import { useSignout } from '@/features/auth/hooks/useAuthApiHooks';

const UserButton = ({
	user,
	className,
	side = 'right',
}: {
	user: UserRead;
	className?: string;
	side?: 'left' | 'right';
}) => {
	const navigate = useRouter();
	const currentMenu = useRouteStore((state) => state.currentMenu);
	const setRightSidebarOpenMap = useLayoutStore((state) => state.setRightSidebarOpenMap);
	const setRightSidebarTypeMap = useLayoutStore((state) => state.setRightSidebarTypeMap);
	const setRightSidebarDataMap = useLayoutStore((state) => state.setRightSidebarDataMap);

	const signout = useSignout();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size='icon' className={cn('data-[state=open]:bg-muted/50 relative h-10 w-10', className)}>
					<AvatarContainer
						src={user?.avatar}
						alt={user?.full_name}
						name={user?.full_name || 'U'}
						avatarClassName='size-9 rounded-md'
						fallbackClassName='flex size-9 items-center justify-center rounded-md bg-black/70 font-bold text-white'
					/>
					{/* <div className={cn(statusOptions[user?.status])}></div> */}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
				side={side}
				align='end'
				sideOffset={5}
			>
				<DropdownMenuItem className='px-1 py-2 font-normal'>
					<AvatarContainer
						src={user?.avatar}
						alt={user?.full_name}
						name={user?.full_name || 'U'}
						avatarClassName='size-8 rounded-md'
						fallbackClassName='flex size-8 items-center justify-center rounded-md bg-black/70 font-bold text-white'
					/>
					<div className='flex max-w-[150px] flex-col text-left text-sm leading-tight'>
						<span className='truncate font-semibold'>{user?.full_name}</span>
						<span className='truncate text-xs'>{user?.email}</span>
					</div>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem
						className='cursor-pointer'
						onSelect={() => {
							setRightSidebarTypeMap(currentMenu, 'Profile');
							setRightSidebarDataMap(currentMenu, { userId: user?.id });
							setRightSidebarOpenMap(currentMenu, true);
						}}
					>
						<BadgeCheck />
						Profile
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className='cursor-pointer'
					onSelect={async () => {
						try {
							await signout.mutateAsync();
							navigate.push('/signin');
						} catch (error) {
							console.error('Failed to sign out:', error);
						}
					}}
				>
					<LogOut />
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserButton;
