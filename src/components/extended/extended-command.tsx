'use client';

import * as React from 'react';
import { CommandDialog, Command } from '@/components/ui/command';
import { Dialog, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { ExtendedDialogContent } from '@/components/extended/extended-dialog';
import { cn } from '@/lib/utils';

type ExtendedCommandDialogProps = React.ComponentProps<typeof CommandDialog> & {
	container?: HTMLElement;
	showOverlay?: boolean;
	shouldFilter?: boolean;
	className?: string;
};

/**
 * A wrapped version of CommandDialog with additional props: container and showOverlay
 */
export function ExtendedCommandDialog({
	title = 'Command Palette',
	description = 'Search for a command to run...',
	container,
	showOverlay,
	shouldFilter = true,
	className,
	children,
	...props
}: ExtendedCommandDialogProps) {
	return (
		<Dialog {...props}>
			<DialogHeader className='sr-only'>
				<DialogTitle>{title}</DialogTitle>
				<DialogDescription>{description}</DialogDescription>
			</DialogHeader>
			<ExtendedDialogContent
				className={cn('overflow-hidden p-0', className)}
				container={container}
				showOverlay={showOverlay}
			>
				<Command
					shouldFilter={shouldFilter}
					className='[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5'
				>
					{children}
				</Command>
			</ExtendedDialogContent>
		</Dialog>
	);
}
