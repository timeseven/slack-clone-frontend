// hooks/useIsMounted.ts
import { useState, useEffect } from 'react';

const useIsMounted = () => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	return isMounted;
};

export default useIsMounted;
