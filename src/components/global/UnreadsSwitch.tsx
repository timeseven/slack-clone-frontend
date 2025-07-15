import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const UnreadsSwitch = () => {
	return (
		<Label htmlFor='unreads' className='min-w-0 text-white'>
			<span className='min-w-4 truncate'>Unreads</span>
			<Switch id='unreads' />
		</Label>
	);
};

export default UnreadsSwitch;
