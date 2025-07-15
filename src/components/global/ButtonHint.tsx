import React from 'react';
import Hint from '@/components/global/Hint';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonHintProps {
	icon: LucideIcon | string;
	hint: string;
	side?: 'top' | 'right' | 'bottom' | 'left';
	align?: 'start' | 'center' | 'end';
	handleClick?: () => void;
	className?: string;
	lucideClassName?: string;
}

const ButtonHint = ({
	icon,
	hint,
	handleClick,
	side = 'bottom',
	align = 'center',
	className,
	lucideClassName,
}: ButtonHintProps) => {
	const isEmoji = typeof icon === 'string';

	return (
		<Hint label={hint} side={side} align={align}>
			<Button size='icon' variant='ghost' className={cn('group', className)} onClick={handleClick}>
				{isEmoji ? (
					<span className='text-sm'>{icon}</span>
				) : (
					(icon as LucideIcon) &&
					React.createElement(icon as LucideIcon, {
						className: lucideClassName,
					})
				)}
			</Button>
		</Hint>
	);
};

export default ButtonHint;
