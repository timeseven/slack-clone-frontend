import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface AvatarContainerProps {
	src?: string | Blob | null;
	alt?: string;
	name: string | React.ReactNode; // Can be a string (user's name) or a React node (e.g. icon)
	avatarClassName?: string;
	fallbackClassName?: string;
	containerProps?: React.ComponentProps<typeof Avatar>;
}

const AvatarContainer: React.FC<AvatarContainerProps> = ({
	src,
	alt,
	name,
	avatarClassName,
	fallbackClassName,
	containerProps,
}) => {
	// Determine the fallback content to display if image is not available or fails to load:
	// - If name is a string, show the first uppercase letter or 'U' as default
	// - Otherwise, render the passed React node (e.g. icon component)
	const fallbackContent = typeof name === 'string' ? name.charAt(0).toUpperCase() || 'U' : name;

	return (
		<Avatar
			// Combine default and user-provided class names, ensure consistent rounded corners
			className={cn('rounded-md', avatarClassName, containerProps?.className)}
			{...containerProps}
		>
			{/* Conditionally render AvatarImage only if src is provided */}
			<AvatarImage src={src || undefined} alt={alt} />

			{/* 
				Display fallback content (initial or icon) when:
				- Image src is not provided, or
				- Image fails to load
			*/}
			<AvatarFallback className={cn('rounded-md bg-indigo-500 text-white', fallbackClassName)}>
				{fallbackContent}
			</AvatarFallback>
		</Avatar>
	);
};

export default AvatarContainer;
