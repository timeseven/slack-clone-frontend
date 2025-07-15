// components/ui/GroupAvatar.tsx
import React from 'react';
import AvatarContainer from './AvatarContainer';
import { cn } from '@/lib/utils';

interface GroupAvatarProps {
	avatars: string[];
	size?: number;
	max?: number;
}

const GroupAvatar: React.FC<GroupAvatarProps> = ({ avatars, size = 5, max = 3 }) => {
	const displayAvatars = avatars.slice(0, max);

	return (
		<div className='flex items-center -space-x-1'>
			{displayAvatars.map((src, index) => (
				<AvatarContainer
					key={index}
					src={src}
					name={src}
					alt={`user-${index}`}
					avatarClassName={cn('rounded-md border border-white', size && `size-${size}`)}
					fallbackClassName={cn('bg-gray-400', size && `size-${size}`)}
				/>
			))}
		</div>
	);
};

export default GroupAvatar;
