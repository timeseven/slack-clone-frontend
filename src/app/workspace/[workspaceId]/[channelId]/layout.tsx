import type React from 'react';

import LayoutChannnelDetailWrapper from '@/components/wrapper/LayoutChannnelDetailWrapper';

const ChannelIdLayout = async ({ children, params }: { children: React.ReactNode; params: { channelId: string } }) => {
	const { channelId } = await params;
	return <LayoutChannnelDetailWrapper channelId={channelId}>{children}</LayoutChannnelDetailWrapper>;
};

export default ChannelIdLayout;
