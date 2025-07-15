// components/AuthProvider.tsx
'use client';

import { useGetMe } from '@/features/user/hooks/useUserApiHooks';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const navigate = useRouter();

	const { data: user, isLoading: loading } = useGetMe();

	useEffect(() => {
		if (!loading && !user) {
			navigate.push('/signin');
		}
	}, [loading, user, navigate]);

	if (loading) return null;

	// Protected routes
	if (user) return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;

	return null;
}

// Use const { user } = useAuthContext(); for getting the user
export const useAuthContext = () => useContext(AuthContext);
