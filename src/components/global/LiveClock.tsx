import { useEffect, useState } from 'react';
import { format } from 'date-fns';

function LiveClock() {
	const [time, setTime] = useState(format(new Date(), 'hh:mm a'));

	useEffect(() => {
		const interval = setInterval(() => {
			setTime(format(new Date(), 'hh:mm a'));
		}, 1000); // Update every second

		return () => clearInterval(interval);
	}, []);

	return <div>{time}</div>;
}

export default LiveClock;
