'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { TooltipContent } from '@/components/ui/tooltip';

import { cn } from '@/lib/utils';

type ExtendedTooltipContentProps = React.ComponentProps<typeof TooltipContent> & {
	bgColor?: string;
	showArrow?: boolean;
};

export function ExtendedTooltipContent({
	bgColor,
	className,
	sideOffset = 0,
	children,
	showArrow = true,
	...props
}: ExtendedTooltipContentProps) {
	return (
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Content
				data-slot='tooltip-content'
				sideOffset={sideOffset}
				className={cn(
					'bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance',
					className,
					bgColor
				)}
				{...props}
			>
				{children}
				{showArrow && (
					<TooltipPrimitive.Arrow
						className={cn(
							'bg-primary fill-primary animate-in fade-in-0 zoom-in-95 z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]',
							bgColor
						)}
					/>
				)}
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Portal>
	);
}
