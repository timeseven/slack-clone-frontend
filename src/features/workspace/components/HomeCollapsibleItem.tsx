'use client';

import type React from 'react';
import { useMemo } from 'react';

import { ChevronRight } from 'lucide-react';

import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import MenuButtonItem from '@/components/global/MenuButtonItem';

import { cn } from '@/lib/utils';
import useRouteStore from '@/stores/useRouteStore';
import { HomeCollapsibleItemProps } from '@/types/workspace';

const HomeCollapsibleItem = ({
	label,
	badge,
	type,
	path,
	icon,
	extra,
	children,
	open,
	setOpen,
}: HomeCollapsibleItemProps) => {
	const currentMenu = useRouteStore((state) => state.currentMenu);
	const routeMap = useRouteStore((state) => state.routeMap);
	const dmRouteMap = useRouteStore((state) => state.dmRouteMap);

	const selectedPath = useMemo(() => {
		if (!currentMenu || !routeMap) return null;
		return routeMap[currentMenu];
	}, [currentMenu, routeMap]);

	const selectedDmPath = useMemo(() => {
		if (!currentMenu || !dmRouteMap) return null;
		return dmRouteMap[currentMenu];
	}, [currentMenu, dmRouteMap]);

	const selectedChild = useMemo(() => {
		if (!children || (!selectedPath && !selectedDmPath)) return null;
		const effectivePath = selectedDmPath || selectedPath;
		if (!effectivePath) return null;

		const findSelected = (items: HomeCollapsibleItemProps[]): HomeCollapsibleItemProps | null => {
			for (const item of items) {
				if (item.path === effectivePath) return item;
				if (item.children) {
					const found = findSelected(item.children);
					if (found) return found;
				}
			}
			return null;
		};

		return findSelected(children);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedPath, selectedDmPath, path, children]);

	if (type === 'channel' || type === 'dm' || type === 'group_dm') {
		return (
			<ContextMenu>
				<ContextMenuTrigger asChild>
					<MenuButtonItem channelType={type} label={label} path={path} icon={icon} badge={badge} size='sm' />
				</ContextMenuTrigger>
				{/* <ContextMenuContent className='w-64'>
					<ContextMenuGroup>
						<ContextMenuItem inset>
							{type === 'channel' ? 'Open channel details' : 'Open message details'}
						</ContextMenuItem>
					</ContextMenuGroup>
					<ContextMenuSeparator />
					<ContextMenuGroup>
						<ContextMenuItem inset>{type === 'channel' ? 'Star channel' : 'Star message'}</ContextMenuItem>
					</ContextMenuGroup>
					<ContextMenuSeparator />
					<ContextMenuGroup>
						<ContextMenuItem inset>Edit settings</ContextMenuItem>
						<ContextMenuSub>
							<ContextMenuSubTrigger inset>Copy</ContextMenuSubTrigger>
							<ContextMenuSubContent className='w-48'>
								<ContextMenuItem>Copy name</ContextMenuItem>
							</ContextMenuSubContent>
						</ContextMenuSub>
					</ContextMenuGroup>
					<ContextMenuSeparator />
					<ContextMenuItem inset className='text-destructive'>
						Leave channel
					</ContextMenuItem>
				</ContextMenuContent> */}
			</ContextMenu>
		);
	}

	return (
		<div className='relative'>
			{
				<Collapsible open={open} onOpenChange={setOpen}>
					<CollapsibleTrigger className={cn('group flex w-full items-center gap-x-2 rounded-md py-1')}>
						<ChevronRight className='h-4 w-4 transition-transform group-data-[state=open]:rotate-90' />
						<span className='flex items-center gap-2 truncate font-semibold'>{label}</span>
					</CollapsibleTrigger>

					<CollapsibleContent className='flex flex-col gap-y-1'>
						{children?.map((child) => (
							<HomeCollapsibleItem key={child.id} {...child} />
						))}
						{extra}
					</CollapsibleContent>
				</Collapsible>
			}

			{!open && selectedChild && (
				<div className='w-full'>
					<HomeCollapsibleItem {...selectedChild} />
				</div>
			)}
		</div>
	);
};

export default HomeCollapsibleItem;
