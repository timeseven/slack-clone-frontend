// hooks/usePublicPath.ts
import { usePathname } from 'next/navigation';

const publicPaths = [
	/^\/workspace\/[^/]+\/join$/,
	/^\/workspace\/[^/]+\/rookie$/,
	/^\/workspace\/[^/]+\/join\/success$/,
	/^\/workspace\/[^/]+\/rookie\/success$/,
];

export function isPublicPath(pathname: string) {
	return publicPaths.some((pattern) =>
		typeof pattern === 'string' ? pattern === pathname : pattern instanceof RegExp ? pattern.test(pathname) : false
	);
}

export function useIsPublicPath() {
	const pathname = usePathname();
	return isPublicPath(pathname);
}
