'use client';

import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HintProps } from '@/types/global';
import { cn } from '@/lib/utils';
import { ExtendedTooltipContent } from '@/components/extended/extended-tooltip';

const Hint = ({ children, label, align, side, showArrow, className }: HintProps) => {
	return (
		<TooltipProvider>
			<Tooltip delayDuration={50}>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<ExtendedTooltipContent
					side={side}
					align={align}
					showArrow={showArrow}
					className={cn('border border-white/5 text-white', className)}
					bgColor='bg-black fill-black'
				>
					<p className='text-xs font-medium'>{label}</p>
				</ExtendedTooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default Hint;
