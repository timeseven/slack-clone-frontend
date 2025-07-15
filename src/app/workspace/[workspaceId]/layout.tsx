import type React from 'react';

import { cookies } from 'next/headers';

import LayoutWorkspaceDetailWrapper from '@/components/wrapper/LayoutWorkspaceDetailWrapper';

const WorkspaceIdLayout = async ({ children }: { children: React.ReactNode }) => {
	const cookieStore = await cookies();
	const layoutStorage = cookieStore.get('layout-storage')?.value;
	const defaultLayout = layoutStorage ? JSON.parse(layoutStorage)?.state : undefined;

	return <LayoutWorkspaceDetailWrapper defaultLayout={defaultLayout}>{children}</LayoutWorkspaceDetailWrapper>;
};

export default WorkspaceIdLayout;
