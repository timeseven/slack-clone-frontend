'use client';

import MainHeader from '@/components/layout/MainHeader';
import MainSidebar from '@/components/layout/MainSidebar';
import MainContent from '@/components/layout/MainContent';
import JoinWorkspaceRoom from '@/components/socketio/JoinWorkspaceRoom';

import { LayoutState } from '@/stores/useLayoutStore';
import { useIsPublicPath } from '@/hooks/usePublicPath';
import useWorkspaceStore from '@/features/workspace/stores/useWorkspaceStore';

const LayoutWorkspaceDetailWrapper = ({
	children,
	defaultLayout,
}: {
	children: React.ReactNode;
	defaultLayout: LayoutState;
}) => {
	const currentWorkspaceId = useWorkspaceStore((state) => state.currentWorkspaceId);
	const isPublic = useIsPublicPath();
	if (isPublic) return <>{children}</>;
	if (!currentWorkspaceId) return null;
	return (
		<div className='h-full'>
			<JoinWorkspaceRoom />
			<MainHeader />
			<div className='flex h-[calc(100vh-40px)]'>
				<MainSidebar />
				<MainContent defaultLayout={defaultLayout}>{children}</MainContent>
			</div>
		</div>
	);
};

export default LayoutWorkspaceDetailWrapper;
