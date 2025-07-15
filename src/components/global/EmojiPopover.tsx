import { ReactNode, useState } from 'react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ExtendedTooltipContent } from '@/components/extended/extended-tooltip';

interface EmojiPopoverProps {
	children: ReactNode;
	hint?: string;
	onEmojiSelect: (emojiValue: string) => void;
}

export const EmojiPopover = ({ children, hint = 'Emoji', onEmojiSelect }: EmojiPopoverProps) => {
	const [popoverOpen, setPopoverOpen] = useState(false);
	const [tooltipOpen, setTooltipOpen] = useState(false);

	const handleSelect = (emoji: EmojiClickData) => {
		onEmojiSelect(emoji.emoji);
		setPopoverOpen(false);
		setTimeout(() => {
			setTooltipOpen(false);
		}, 200);
	};

	return (
		<TooltipProvider>
			<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
				<Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen} delayDuration={50}>
					<PopoverTrigger asChild>
						<TooltipTrigger asChild>{children}</TooltipTrigger>
					</PopoverTrigger>
					<ExtendedTooltipContent className='border border-white/5 text-white' bgColor='bg-black fill-black'>
						<p className='text-xs font-medium'>{hint}</p>
					</ExtendedTooltipContent>
				</Tooltip>
				<PopoverContent className='w-full border-none p-0 shadow-none'>
					<EmojiPicker onEmojiClick={handleSelect} />
				</PopoverContent>
			</Popover>
		</TooltipProvider>
	);
};
