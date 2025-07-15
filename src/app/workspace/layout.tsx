import type React from 'react';

import LayoutWorkspaceWrapper from '@/components/wrapper/LayoutWorkspaceWrapper';

const WorkspaceLayout = async ({ children }: { children: React.ReactNode }) => {
	return <LayoutWorkspaceWrapper>{children}</LayoutWorkspaceWrapper>;
};

export default WorkspaceLayout;
