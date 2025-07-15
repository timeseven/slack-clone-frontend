import React from 'react';
import DMSList from '@/features/message/components/DMSList';
import SearchDropdown from '@/components/global/SearchDropdown';

const DMSSidebarList = () => {
	return (
		<>
			<SearchDropdown />
			<DMSList />
		</>
	);
};

export default DMSSidebarList;
