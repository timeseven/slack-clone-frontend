import { useState, useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
const useDebounce = (value: string | number, delay: number) => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	const debounced = useMemo(() => debounce(setDebouncedValue, delay), [delay]);

	useEffect(() => {
		debounced(value);

		return () => {
			debounced.cancel();
		};
	}, [value, debounced]);

	return debouncedValue;
};

export default useDebounce;
