'use client';

import { ReactNode, useCallback, useMemo } from 'react';

import LeftSecondarySidebar from '@/components/layout/LeftSecondarySidebar';
import RightSecondarySidebar from '@/components/layout/RightSecondarySidebar';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

import useIsMounted from '@/hooks/useIsMounted';
import useLayoutStore, { LayoutState } from '@/stores/useLayoutStore';

import { cn } from '@/lib/utils';

import { FULL_SIZE, MAX_LEFT_SIZE, MIN_MIDDLE_SIZE, MIN_LEFT_SIZE, MIN_RIGHT_SIZE } from '@/consts/layout';
import useRouteStore from '@/stores/useRouteStore';

const MainContent = ({ defaultLayout, children }: { defaultLayout: LayoutState; children: ReactNode }) => {
	const isMounted = useIsMounted();

	const currentMenu = useRouteStore((state) => state.currentMenu);
	const leftSidebarOpenMap = useLayoutStore((state) => state.leftSidebarOpenMap);
	const rightSidebarOpenMap = useLayoutStore((state) => state.rightSidebarOpenMap);
	// const openRightSidebar = useLayoutStore((state) => state.openRightSidebar);
	const leftSize = useLayoutStore((state) => state.leftSize);
	const rightSize = useLayoutStore((state) => state.rightSize);

	const setLeftSize = useLayoutStore((state) => state.setLeftSize);
	const setRightSize = useLayoutStore((state) => state.setRightSize);

	const effectiveOpenLeft = isMounted
		? leftSidebarOpenMap[currentMenu]
		: defaultLayout?.leftSidebarOpenMap?.[currentMenu];
	const effectiveOpenRight = isMounted
		? rightSidebarOpenMap[currentMenu]
		: defaultLayout?.rightSidebarOpenMap?.[currentMenu];
	const effectiveLeftSize = isMounted ? leftSize : defaultLayout?.leftSize;
	const effectiveRightSize = isMounted ? rightSize : defaultLayout?.rightSize;

	// Set the left and right sizes when user resize
	const handleResize = useCallback(() => {
		const leftSidebar = document.getElementById('left-sidebar');
		if (leftSidebar) {
			const realTimeLeftSize = leftSidebar.getAttribute('data-panel-size');
			if (realTimeLeftSize) {
				setLeftSize(Number(realTimeLeftSize));
			}
		}

		const rightSidebar = document.getElementById('right-sidebar');
		if (rightSidebar) {
			const realTimeRightSize = rightSidebar.getAttribute('data-panel-size');
			if (realTimeRightSize) {
				setRightSize(Number(realTimeRightSize));
			}
		}
	}, [setLeftSize, setRightSize]);

	// Calculate middle size based on effectiveOpenRight, effectiveOpenLeft  effectiveLeftSize, effectiveRightSize
	const calculatedMiddleSize = useMemo(() => {
		if (effectiveOpenRight && effectiveOpenLeft) {
			return FULL_SIZE - effectiveLeftSize - effectiveRightSize;
		} else if (effectiveOpenRight && !effectiveOpenLeft) {
			return FULL_SIZE - effectiveRightSize;
		} else if (!effectiveOpenRight && effectiveOpenLeft) {
			return FULL_SIZE - effectiveLeftSize;
		} else {
			return FULL_SIZE;
		}
	}, [effectiveOpenRight, effectiveOpenLeft, effectiveLeftSize, effectiveRightSize]);

	// Calculate max right size based on effectiveOpenLeft, effectiveLeftSize
	const calcuulatedMaxRightSize = useMemo(() => {
		if (effectiveOpenLeft) {
			return FULL_SIZE - MIN_MIDDLE_SIZE - effectiveLeftSize;
		} else {
			return FULL_SIZE - MIN_MIDDLE_SIZE;
		}
	}, [effectiveOpenLeft, effectiveLeftSize]);

	return (
		<ResizablePanelGroup direction='horizontal' id='panel-group'>
			{effectiveOpenLeft && (
				<>
					<ResizablePanel
						id='left-sidebar'
						defaultSize={effectiveLeftSize}
						minSize={MIN_LEFT_SIZE}
						maxSize={MAX_LEFT_SIZE}
						order={1}
					>
						<LeftSecondarySidebar />
					</ResizablePanel>
					<ResizableHandle
						onDragging={(isDragging) => {
							if (isDragging) return;
							handleResize();
						}}
					/>
				</>
			)}

			<ResizablePanel
				defaultSize={calculatedMiddleSize}
				id='content'
				minSize={MIN_MIDDLE_SIZE}
				maxSize={FULL_SIZE}
				order={2}
				className='bg-primary'
			>
				<div
					className={cn('h-full w-full bg-white', {
						'rounded-tl-lg': !effectiveOpenLeft,
					})}
				>
					{children}
				</div>
			</ResizablePanel>

			{effectiveOpenRight && (
				<>
					<ResizableHandle
						onDragging={(isDragging) => {
							if (isDragging) return;
							handleResize();
						}}
					/>
					<ResizablePanel
						id='right-sidebar'
						defaultSize={effectiveRightSize}
						minSize={MIN_RIGHT_SIZE}
						maxSize={calcuulatedMaxRightSize}
						order={3}
						className='shadow-2xl'
					>
						<RightSecondarySidebar />
					</ResizablePanel>
				</>
			)}
		</ResizablePanelGroup>
	);
};

export default MainContent;
