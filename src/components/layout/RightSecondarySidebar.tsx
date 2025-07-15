'use client';

import type React from 'react';

import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import useRouteStore from '@/stores/useRouteStore';
import useLayoutStore from '@/stores/useLayoutStore';
import ReplyPanel from '@/features/message/components/ReplyPanel';
import FilePanel from '@/features/file/components/FilePanel';
import ProfilePanel from '@/features/user/components/ProfilePanel';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const panelMap: Record<string, React.FC<{ data: any }>> = {
	Reply: ReplyPanel,
	File: FilePanel,
	Profile: ProfilePanel,
};

const RightSecondarySidebar = () => {
	const currentMenu = useRouteStore((state) => state.currentMenu);
	const rightSidebarTypeMap = useLayoutStore((state) => state.rightSidebarTypeMap);
	const rightSidebarDataMap = useLayoutStore((state) => state.rightSidebarDataMap);
	const setRightSidebarOpenMap = useLayoutStore((state) => state.setRightSidebarOpenMap);
	const type = rightSidebarTypeMap[currentMenu];
	const data = rightSidebarDataMap[currentMenu];
	const PanelComponent = panelMap[type];
	return (
		<div className='flex h-full flex-col'>
			<div className='flex h-14 items-center justify-between p-2'>
				<span className='font-semibold'>{type}</span>
				<Button size='icon' variant='ghost' onClick={() => setRightSidebarOpenMap(currentMenu, false)}>
					<X />
				</Button>
			</div>
			<div className='flex-1 overflow-auto'>
				{PanelComponent ? <PanelComponent data={data} /> : <div className='text-muted-foreground'>Unknown panel</div>}
			</div>
		</div>
	);
};

export default RightSecondarySidebar;
