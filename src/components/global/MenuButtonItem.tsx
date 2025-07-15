'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

import useRouteStore from '@/stores/useRouteStore';
import AvatarContainer from './AvatarContainer';
import useWorkspaceStore from '@/features/workspace/stores/useWorkspaceStore';
import AvatarGroup from './AvatarGroup';
import { useAuthContext } from '@/context/AuthContext';
import { useGetOrCreateDms } from '@/features/channel/hooks/useChannelApiHooks';
import useLayoutStore from '@/stores/useLayoutStore';

interface MenuLinkItemProps {
	icon?: LucideIcon | string | string[];
	label: string;
	path?: string;
	badge?: number;
	link?: string;
	size?: 'sm' | 'default';
	channelType?: string;
	ref?: React.RefObject<HTMLAnchorElement | null>;
}

const MenuButtonItem = ({
	icon: Icon,
	label,
	channelType,
	path,
	badge,
	size = 'sm',
	...props
}: MenuLinkItemProps & React.ComponentProps<typeof Button>) => {
	const { user } = useAuthContext();
	const currentWorkspaceId = useWorkspaceStore((state) => state.currentWorkspaceId);
	const { currentMenu, routeMap, setRouteMap, dmRouteMap, setDmRouteMap } = useRouteStore();
	const { setRightSidebarOpenMap } = useLayoutStore();

	const getOrCreateDms = useGetOrCreateDms();
	const handleClick = async () => {
		if (!path) return;
		if (path.includes('members')) {
			setDmRouteMap(currentMenu, path);
			setRouteMap(currentMenu, '');
			// get the dm
			const member_id = path.split('members/')[1];
			try {
				const response = await getOrCreateDms.mutateAsync({
					workspaceId: currentWorkspaceId,
					userId: member_id,
				});
				const { channel_id } = response.data;
				setRouteMap(currentMenu, `/workspace/${currentWorkspaceId}/${channel_id}`);
			} catch (error) {
				console.log('error', error);
			}
		} else {
			//  redirect to channel
			setDmRouteMap(currentMenu, '');
			setRouteMap(currentMenu, path);
		}
		setRightSidebarOpenMap(currentMenu, false);
	};

	return (
		<Button
			variant='ghost'
			size={size}
			className={cn('group/menu-button-item relative w-full justify-start text-white', {
				'bg-accent text-accent-foreground dark:bg-accent/50': path?.includes('members')
					? path == dmRouteMap[currentMenu]
					: path == routeMap[currentMenu],
				'font-bold': badge,
			})}
			onClick={handleClick}
			{...props}
		>
			{Icon &&
				(Array.isArray(Icon) ? (
					<AvatarGroup
						className='flex items-center border-none bg-transparent'
						max={3}
						showNumber={false}
						offset='-ml-1'
					>
						{Icon?.map((src, index) => (
							<AvatarContainer
								key={src}
								src={src}
								alt={`user-${index}`}
								name={src}
								avatarClassName='size-6 rounded-md'
								fallbackClassName='flex size-6 items-center justify-center rounded-md bg-black/70 font-bold text-white'
							/>
						))}
					</AvatarGroup>
				) : typeof Icon === 'string' ? (
					<AvatarContainer
						src={Icon}
						alt={label}
						name={label}
						avatarClassName='size-6 rounded-md'
						fallbackClassName='flex size-6 items-center justify-center rounded-md bg-black/70 font-bold text-white'
					/>
				) : (
					<Icon className='size-4' />
				))}
			<span className='inline-block max-w-[40%] truncate'>{label}</span>
			{!!(channelType === 'dm' && user?.full_name === label) && <span className='truncate'> (You)</span>}

			{typeof badge === 'number' && badge > 0 && (
				<span
					className={cn(
						'bg-accent text-accent-foreground group-hover/menu-button-item:text-accent group-hover/menu-button-item:bg-primary/50 ml-auto flex size-5 items-center justify-center rounded-full text-xs',
						{
							'text-accent bg-primary/50': path?.includes('members')
								? path == dmRouteMap[currentMenu]
								: path == routeMap[currentMenu],
						}
					)}
				>
					{badge}
				</span>
			)}
		</Button>
	);
};

export default MenuButtonItem;
