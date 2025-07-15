'use client';

import { ChevronRight } from 'lucide-react';
import { isToday, isYesterday, differenceInCalendarDays, format } from 'date-fns';

import { Button } from '@/components/ui/button';
import AvatarContainer from '@/components/global/AvatarContainer';

import { UserBaseRead } from '@/types/user';
import { MessageReadBase } from '@/types/message';
import { cn } from '@/lib/utils';

const formatReplyTimestamp = (date: Date) => {
	if (isToday(date)) {
		return `Last reply today at ${format(date, 'h:mm a')}`;
	}
	if (isYesterday(date)) {
		return `Last reply yesterday at ${format(date, 'h:mm a')}`;
	}

	const daysAgo = differenceInCalendarDays(new Date(), date);
	if (daysAgo <= 7) {
		return `${daysAgo} days ago`;
	}

	return format(date, "d MMMM 'at' h:mm:ss a");
};
const Replies = ({
	disabled,
	replies,
	onReply,
}: {
	disabled: boolean;
	replies: MessageReadBase[];
	onReply: () => void;
}) => {
	const uniqueSendersMap = new Map<string, UserBaseRead>();
	replies?.forEach((reply) => {
		if (reply.sender?.id && !uniqueSendersMap.has(reply.sender.id)) {
			uniqueSendersMap.set(reply.sender.id, reply.sender);
		}
	});

	const uniqueSenders = Array.from(uniqueSendersMap.values());

	return (
		<div
			className={cn(
				'border-background group-hover/message:border-muted text-muted-foreground relative mt-2 flex h-full cursor-pointer items-center justify-between gap-2 rounded-lg border px-2 py-1 text-sm',
				{
					'group/replies hover:border-gray-400 hover:bg-white': !disabled,
				}
			)}
			onClick={onReply}
		>
			<div className='flex items-center gap-x-2'>
				<div className='flex items-center gap-x-1'>
					{uniqueSenders.slice(0, 3).map((user) => (
						<Button key={user.id} variant='ghost' className='px-0' disabled={disabled}>
							<AvatarContainer
								src={user?.avatar}
								alt={user?.full_name || 'User'}
								name={user?.full_name || 'U'}
								avatarClassName='size-7 rounded-lg'
								fallbackClassName='bg-primary text-white'
							/>
						</Button>
					))}
				</div>
				<Button variant='link' size='sm' className='px-0' disabled={disabled}>
					{replies.length} {replies.length === 1 ? 'reply' : 'replies'}
				</Button>
				<span className='group-hover/replies:hidden'>{formatReplyTimestamp(new Date(replies?.[0]?.created_at))}</span>
				<span className='hidden group-hover/replies:block'>View {replies.length === 1 ? 'reply' : 'replies'}</span>
			</div>
			<ChevronRight className='hidden size-4 group-hover/replies:block' />
		</div>
	);
};

export default Replies;
