'use client';

import { SmilePlus, MessageCircleMore, EllipsisVertical } from 'lucide-react';

import { Button } from '@/components/ui/button';
import ButtonHint from '@/components/global/ButtonHint';
import { EmojiPopover } from '@/components/global/EmojiPopover';
import { cn } from '@/lib/utils';

const ActionToolbar = ({
	isReplyable,
	onReaction,
	onReply,
	onEdit,
	className,
}: {
	isReplyable: boolean;
	onReaction: (emoji: string) => void;
	onReply?: () => void;
	onEdit: () => void;
	className?: string;
}) => {
	return (
		<div
			className={cn(
				'bg-background pointer-events-none absolute -top-4 right-5 z-10 flex items-center gap-x-1 rounded-lg border p-1 opacity-0 transition-opacity duration-200 group-hover/message:pointer-events-auto group-hover/message:opacity-100',
				className
			)}
		>
			<ButtonHint icon='✅' hint='Check' side='top' className='size-7' handleClick={() => onReaction('✅')} />
			<ButtonHint icon='👀' hint='Take a look' side='top' className='size-7' handleClick={() => onReaction('👀')} />
			<ButtonHint icon='🙌' hint='Applause' side='top' className='size-7' handleClick={() => onReaction('🙌')} />
			<EmojiPopover hint='React' onEmojiSelect={(emoji) => onReaction(emoji)}>
				<Button size='sm' variant='ghost' className='size-7 !px-1'>
					<SmilePlus />
				</Button>
			</EmojiPopover>
			{isReplyable && (
				<ButtonHint icon={MessageCircleMore} hint='Reply' side='top' className='size-7' handleClick={onReply} />
			)}
			<ButtonHint icon={EllipsisVertical} hint='More' side='top' className='size-7' handleClick={onEdit} />
		</div>
	);
};

export default ActionToolbar;
