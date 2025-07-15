'use client';

import React from 'react';
import { Toaster } from '@/components/ui/sonner';
import { ReactQueryProvider } from '@/context/ReactQueryContext';

const RootLayoutWrapper = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<ReactQueryProvider>
			<Toaster />
			{children}
		</ReactQueryProvider>
	);
};

export default RootLayoutWrapper;
