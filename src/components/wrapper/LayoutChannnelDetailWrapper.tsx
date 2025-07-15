import React from 'react';

import JoinChannelRoom from '@/components/socketio/JoinChannelRoom';

const LayoutChannnelDetailWrapper = ({ children, channelId }: { children: React.ReactNode; channelId: string }) => {
	return (
		<div className='h-full'>
			<JoinChannelRoom channelId={channelId} />
			{children}
		</div>
	);
};

export default LayoutChannnelDetailWrapper;
