'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

import { DialogContent, DialogOverlay, DialogPortal } from '@/components/ui/dialog';
import { XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

type ExtendedDialogContentProps = React.ComponentProps<typeof DialogContent> & {
	container?: HTMLElement;
	showOverlay?: boolean;
	className?: string;
};

export function ExtendedDialogContent({
	container,
	showOverlay = true,
	className,
	children,
	...props
}: ExtendedDialogContentProps) {
	const isCustomPosition = className?.includes('absolute') || className?.includes('fixed');

	return (
		<DialogPortal container={container} data-slot='dialog-portal'>
			{showOverlay && <DialogOverlay />}
			<DialogPrimitive.Content
				data-slot='dialog-content'
				className={cn(
					'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-50 grid w-full max-w-[calc(100%-2rem)] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg',
					{ 'fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]': !isCustomPosition },
					className
				)}
				{...props}
			>
				{children}
				<DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
					<XIcon />
					<span className='sr-only'>Close</span>
				</DialogPrimitive.Close>
			</DialogPrimitive.Content>
		</DialogPortal>
	);
}
