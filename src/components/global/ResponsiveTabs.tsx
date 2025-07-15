'use client';

import React, { memo, useEffect, useReducer, useRef } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TabItem {
	name: string;
	value: string;
	icon?: React.ElementType;
	content?: React.ReactNode;
}

const ResponsiveTabs = ({
	tabs,
	activeTab,
	onTabChange,
}: {
	tabs: TabItem[];
	activeTab: string;
	onTabChange: (tab: string) => void;
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
	const [, forceUpdate] = useReducer((x) => x + 1, 0);
	const visibleTabsRef = useRef<TabItem[]>([]);
	const hiddenTabsRef = useRef<TabItem[]>([]);
	const cumulativeWidthsRef = useRef<number[]>([]);

	useEffect(() => {
		requestAnimationFrame(() => {
			const tabWidths: Record<string, number> = {};
			const cumulative: number[] = [];
			let total = 0;
			for (const tab of tabs) {
				const el = tabRefs.current[tab.value];
				if (el) {
					const width = el.getBoundingClientRect().width;
					tabWidths[tab.value] = width;
					total += width;
					cumulative.push(total);
				}
			}

			cumulativeWidthsRef.current = cumulative;
			handleResize();
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleResize = () => {
		const containerWidth = containerRef.current?.offsetWidth || 0;
		const moreButtonWidth = 40;
		const padding = 32;
		const availableWidth = containerWidth - moreButtonWidth - padding;
		const cumulative = cumulativeWidthsRef.current;

		// Binary search
		let left = 0;
		let right = cumulative.length - 1;
		let lastVisibleIndex = -1;

		while (left <= right) {
			const mid = Math.floor((left + right) / 2);
			if (cumulative[mid] <= availableWidth) {
				lastVisibleIndex = mid;
				left = mid + 1;
			} else {
				right = mid - 1;
			}
		}

		visibleTabsRef.current = tabs.slice(0, lastVisibleIndex + 1);
		hiddenTabsRef.current = tabs.slice(lastVisibleIndex + 1);

		forceUpdate();
	};

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;
		const observer = new ResizeObserver(handleResize);
		observer.observe(container);
		return () => observer.disconnect();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Tabs value={activeTab} onValueChange={onTabChange}>
			{/* Shadow tab list, used for measuring width, visually hidden */}
			<div className='pointer-events-none absolute top-0 left-0 z-[-1] flex gap-1 opacity-0'>
				{tabs.map((tab) => (
					<button
						key={tab.value}
						ref={(el) => {
							tabRefs.current[tab.value] = el;
						}}
						className='flex items-center gap-1 border px-2 py-1 text-sm font-medium'
					>
						{tab.icon && <tab.icon className='size-4 shrink-0' />}
						{tab.name}
					</button>
				))}
			</div>
			<div ref={containerRef} className='border-secondary/25 flex items-center gap-1 overflow-hidden border-b px-4'>
				<TabsList className='flex bg-transparent p-0'>
					{tabs.map((tab) => (
						<TabsTrigger
							key={tab.value}
							value={tab.value}
							className={cn(
								'text-secondary h-full rounded-none border-b-2 border-transparent',
								'data-[state=active]:border-b-white data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none',
								{
									hidden: !visibleTabsRef.current.includes(tab),
								}
							)}
						>
							{tab.icon && <tab.icon className='size-4 shrink-0' />}
							{tab.name}
						</TabsTrigger>
					))}
				</TabsList>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant='ghost'
							size='icon'
							className={cn('text-secondary hover:bg-muted ml-auto hidden h-8 w-8', {
								flex: hiddenTabsRef.current.length > 0,
							})}
						>
							<MoreHorizontal size={16} />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						{hiddenTabsRef.current.map((tab) => (
							<DropdownMenuItem key={tab.value} onClick={() => onTabChange(tab.value)} className='cursor-pointer'>
								{tab.icon && <tab.icon size={14} className='mr-2' />}
								{tab.name}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Contents */}
			{tabs.map((tab) => (
				<TabsContent key={tab.value} value={tab.value}>
					Content for {tab.name}
				</TabsContent>
			))}
		</Tabs>
	);
};

export default memo(ResponsiveTabs);
