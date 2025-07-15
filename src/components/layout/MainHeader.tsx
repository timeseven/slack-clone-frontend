'use client';

import { memo } from 'react';

import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

import { Button } from '@/components/ui/button';

import useLayoutStore from '@/stores/useLayoutStore';

import SearchDialog from '@/components/global/SearchDialog';
import useRouteStore from '@/stores/useRouteStore';

const MainHeader = () => {
	const currentMenu = useRouteStore((state) => state.currentMenu);
	const leftSidebarOpenMap = useLayoutStore((state) => state.leftSidebarOpenMap);
	const setLeftSidebarOpenMap = useLayoutStore((state) => state.setLeftSidebarOpenMap);

	return (
		<div className='bg-primary flex h-10 items-center justify-between'>
			<div className='w-15'></div>
			<div className='flex h-full flex-1 items-center'>
				<div className='basis-1/6'>
					<Button
						variant='ghost'
						className='group h-7 w-7'
						onClick={() => setLeftSidebarOpenMap(currentMenu, !leftSidebarOpenMap[currentMenu])}
					>
						{leftSidebarOpenMap[currentMenu] ? (
							<PanelLeftClose className='text-white group-hover:text-black' />
						) : (
							<PanelLeftOpen className='text-white group-hover:text-black' />
						)}

						<span className='sr-only'>Toggle sidebar</span>
					</Button>
				</div>
				<SearchDialog />
			</div>
		</div>
	);
};

export default memo(MainHeader);
