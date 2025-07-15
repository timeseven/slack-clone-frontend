'use client';

import type { ComponentType } from 'react';
import { useEffect, useState, memo, lazy, Suspense } from 'react';

import { AtSign, MessageSquareMore, Smile, Send } from 'lucide-react';

import { MenuKey } from '@/types/layout';
import { TabItem } from '@/components/global/ResponsiveTabs';
import useRouteStore from '@/stores/useRouteStore';
import LeftSecondarySidebarHeaderSkeleton from '@/components/skeleton/LeftSecondarySidebarHeaderSkeleton';
import LeftSecondarySidebarContentSkeleton from '@/components/skeleton/LeftSecondarySidebarContentSkeleton';

const DMSSidebarList = lazy(() => import('@/components/layout/DMSSidebarList'));
const DMSSidebarHeader = lazy(() => import('@/components/layout/DMSSidebarHeader'));
const HomeSidebarList = lazy(() => import('@/components/layout/HomeSidebarList'));
const HomeSidebarHeader = lazy(() => import('@/components/layout/HomeSidebarHeader'));
const ActivitySidebarHeader = lazy(() => import('@/components/layout/ActivitySidebarHeader'));
const ResponsiveTabs = lazy(() => import('@/components/global/ResponsiveTabs'));

interface SidebarConfig {
	tabs?: TabItem[];
	defaultTab?: string;
	header?: ComponentType;
	list?: ComponentType;
}

const sidebarConfigs: Partial<Record<MenuKey, SidebarConfig>> = {
	Home: {
		header: HomeSidebarHeader,
		list: HomeSidebarList,
	},
	DMs: {
		header: DMSSidebarHeader,
		list: DMSSidebarList,
	},
	Activity: {
		header: ActivitySidebarHeader,
		tabs: [
			{ name: 'All', value: 'all' },
			{ name: 'Mentions', value: 'mentions', icon: AtSign },
			{ name: 'Threads', value: 'threads', icon: MessageSquareMore },
			{ name: 'Reactions', value: 'reactions', icon: Smile },
			{ name: 'Invitations', value: 'invitations', icon: Send },
		],
		defaultTab: 'all',
	},
};

const SidebarHeader = memo(({ currentMenu }: { currentMenu: MenuKey }) => {
	const config = sidebarConfigs[currentMenu];
	const HeaderComponent = config?.header;

	if (!HeaderComponent) return null;

	return (
		<Suspense fallback={<LeftSecondarySidebarHeaderSkeleton />}>
			<HeaderComponent />
		</Suspense>
	);
});

SidebarHeader.displayName = 'SidebarHeader';

const SidebarContent = memo(
	({
		currentMenu,
		activeTab,
		onTabChange,
	}: {
		currentMenu: MenuKey;
		activeTab: string;
		onTabChange: (tab: string) => void;
	}) => {
		const config = sidebarConfigs[currentMenu];
		if (config?.tabs) {
			return (
				<Suspense fallback={<LeftSecondarySidebarContentSkeleton />}>
					<ResponsiveTabs
						key={`${currentMenu}-tabs`}
						tabs={config.tabs}
						activeTab={activeTab}
						onTabChange={onTabChange}
					/>
				</Suspense>
			);
		}

		const ListComponent = config?.list;
		if (!ListComponent) return null;

		return (
			<Suspense fallback={<LeftSecondarySidebarContentSkeleton />}>
				<ListComponent />
			</Suspense>
		);
	}
);

SidebarContent.displayName = 'SidebarContent';

const LeftSecondarySidebar = () => {
	const currentMenu = useRouteStore((state) => state.currentMenu);
	const [activeTab, setActiveTab] = useState('');

	useEffect(() => {
		const config = sidebarConfigs[currentMenu];
		const defaultTab = config?.defaultTab;

		if (defaultTab) {
			setActiveTab(defaultTab);
		} else {
			setActiveTab('');
		}
	}, [currentMenu]);

	const hasConfig = Boolean(sidebarConfigs[currentMenu]);

	if (!hasConfig) {
		return (
			<div className='bg-primary flex h-full flex-col'>
				<div className='bg-muted/20 flex h-15 items-center justify-center rounded-tl-lg p-3'>
					<span className='text-muted-foreground text-sm'>No content available</span>
				</div>
			</div>
		);
	}

	return (
		<div className='bg-primary flex h-full flex-col'>
			<div className='bg-muted/20 flex min-h-[3.75rem] items-center justify-between rounded-tl-lg p-3'>
				<SidebarHeader currentMenu={currentMenu} />
			</div>

			<div className='bg-muted/20 flex flex-1 flex-col gap-y-3 overflow-hidden'>
				<SidebarContent currentMenu={currentMenu} activeTab={activeTab} onTabChange={setActiveTab} />
			</div>
		</div>
	);
};

export default memo(LeftSecondarySidebar);
