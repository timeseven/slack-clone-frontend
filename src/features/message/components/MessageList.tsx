'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import throttle from 'lodash.throttle';
import { format, isToday, isYesterday } from 'date-fns';
import { ArrowDown, ArrowUp, Loader } from 'lucide-react';

import { Button } from '@/components/ui/button';
import DmHero from '@/components/global/DmHero';

import { cn } from '@/lib/utils';
import { dateFormat } from '@/consts/general';
import type { MessageRead } from '@/types/message';
import Message from '@/features/message/components/Message';
import { ChannelMemberRead, ChannelRead } from '@/types/channel';
import ChannelHero from '@/features/channel/components/ChannelHero';
import { WorkspaceRead } from '@/types/workspace';

const formatDateLabel = (date: string) => {
	const currentDate = new Date(date);
	if (isToday(currentDate)) return 'Today';
	if (isYesterday(currentDate)) return 'Yesterday';
	return format(currentDate, 'MMM d, yyyy'); // e.g. Jun 5, 2025
};
const MessageList = ({
	messages = [],
	workspace,
	channel,
	channelMembers,
	owner,
	onFetchOlder,
	isFetchingOlder,
	hasMoreOlder,
	isLoading,
	handleClearUnreadCount,
}: {
	messages: MessageRead[];
	workspace?: WorkspaceRead;
	channel?: ChannelRead;
	channelMembers?: ChannelMemberRead[];
	owner?: ChannelMemberRead;
	onFetchOlder?: () => void;
	onFetchNewer?: () => void;
	isFetchingOlder?: boolean;
	isFetchingNewer?: boolean;
	hasMoreOlder?: boolean;
	hasMoreNewer?: boolean;
	isLoading?: boolean;
	handleClearUnreadCount: () => void;
}) => {
	const lastReadAt = channel?.membership?.last_read_at || '';
	const unreadCount = channel?.membership?.unread_count || 0;
	// Reference to scroll to bottom
	const beginningRef = useRef<HTMLDivElement | null>(null);
	const scrollRef = useRef<HTMLDivElement>(null);
	const dateRefMap = useRef<Map<string, HTMLDivElement>>(new Map());
	const lastReadRef = useRef<HTMLDivElement>(null);
	const [isAutoScroll, setIsAutoScroll] = useState(true);

	const isFetchingOlderRef = useRef(false);
	const hasMoreOlderRef = useRef(false);
	const isRestoringScrollRef = useRef(false);

	const [hideUnreadButton, setHideUnreadButton] = useState(false);

	// Group messages by date
	const groupedMessages = useMemo(() => {
		return messages?.reduce(
			(groups, message) => {
				const date = new Date(message.created_at);
				const dateKey = format(date, dateFormat);
				if (!groups[dateKey]) {
					groups[dateKey] = [];
				}
				groups[dateKey].unshift(message);
				return groups;
			},
			{} as Record<string, typeof messages>
		);
	}, [messages]);

	const handleLoadOlder = async () => {
		if (isFetchingOlderRef.current || !hasMoreOlderRef.current || isRestoringScrollRef.current) return;

		const el = scrollRef.current;
		if (!el) return;
		const prevScrollTop = el.scrollTop;

		isRestoringScrollRef.current = true;

		await onFetchOlder?.();

		requestAnimationFrame(() => {
			if (Math.abs(el.scrollTop) > el.scrollHeight * 0.7) {
				el.scrollTop = prevScrollTop;
			}
			requestAnimationFrame(() => {
				isRestoringScrollRef.current = false;
			});
		});
	};

	// Set beginning ref
	useEffect(() => {
		if (beginningRef.current) {
			dateRefMap.current.set('beginning', beginningRef.current);
		}
	}, []);

	// Enable auto-scroll
	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;

		const handleScroll = throttle(async () => {
			if (Math.abs(el.scrollTop) > el.scrollHeight * 0.7) {
				handleLoadOlder();
			}
			// Check if at bottom
			const atBottom = el.scrollTop > -10;
			setIsAutoScroll(atBottom);
		}, 200);

		el.addEventListener('scroll', handleScroll);

		return () => {
			el.removeEventListener('scroll', handleScroll);
			handleScroll.cancel(); // cancel pending throttled call
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Scroll to bottom
	useEffect(() => {
		if (isAutoScroll && scrollRef.current) {
			requestAnimationFrame(() => {
				scrollRef.current!.scrollTop = 0;
			});
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [messages]);

	useEffect(() => {
		isFetchingOlderRef.current = isFetchingOlder || false;
		hasMoreOlderRef.current = hasMoreOlder || false;
	}, [isFetchingOlder, hasMoreOlder]);

	// Obsereve last read
	useEffect(() => {
		const el = lastReadRef.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setTimeout(() => setHideUnreadButton(true), 1000);
					setTimeout(() => handleClearUnreadCount(), 3000);
				}
			},
			{
				threshold: 0,
				rootMargin: '300px 0px 0px 0px',
			}
		);

		observer.observe(el);

		return () => observer.disconnect();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [messages.length]);

	return (
		<div className='relative flex flex-1 overflow-hidden'>
			<div ref={scrollRef} className='relative flex flex-1 flex-col-reverse pb-4' style={{ overflowY: 'auto' }}>
				{Object.entries(groupedMessages || {}).map(([dateKey, msgs]) => {
					return (
						<div
							key={dateKey}
							ref={(el) => {
								if (el) dateRefMap.current.set(dateKey, el);
							}}
						>
							<div className='relative my-2 text-center'>
								<hr className='absolute top-3 right-0 left-0 border-t border-gray-300' />
							</div>
							<div className='sticky top-2 z-10 flex items-center justify-center'>
								<span className='cursor-pointer rounded-full border border-gray-300 bg-white px-4 py-1 text-xs'>
									{formatDateLabel(dateKey)}
								</span>
							</div>

							{msgs.map((msg, idx) => {
								let insertLastReadRef = false;

								if (lastReadAt) {
									const messageTime = new Date(msg.created_at).getTime();
									const lastReadTime = new Date(lastReadAt).getTime();

									// Find the first message that is newer than the last read
									if (messageTime > lastReadTime && unreadCount > 0) {
										if (idx === 0 || new Date(msgs[idx - 1].created_at).getTime() <= lastReadTime) {
											insertLastReadRef = true;
										}
									}
								}
								return (
									<div key={msg.id}>
										{insertLastReadRef && (
											<div ref={lastReadRef} className='my-4 flex items-center'>
												<div className='flex-grow border-t-2 border-red-300'></div>
												<span className='mx-4 text-sm font-semibold text-red-300'>Below are new messages</span>
												<div className='flex-grow border-t-2 border-red-300'></div>
											</div>
										)}
										<Message disabled={!channel?.membership} message={msg} workspace={workspace} />
									</div>
								);
							})}
						</div>
					);
				})}
				{isFetchingOlder && (
					<div className='my-5 flex w-full justify-center'>
						<Loader className='size-10 animate-spin' />
					</div>
				)}
				{!isLoading && (channel?.type === 'channel' || channel?.type === 'group_dm') && (
					<div ref={beginningRef}>
						<ChannelHero
							disabled={!channel?.membership}
							owner={owner}
							channelName={channel.name}
							channelCreatedAt={channel.created_at}
						/>
					</div>
				)}
				{!isLoading && channel?.type === 'dm' && (
					<div ref={beginningRef}>
						<DmHero channelMembers={channelMembers} />
					</div>
				)}
			</div>
			{!!unreadCount && unreadCount > 15 && (
				<div
					className={cn(
						'bg-primary absolute top-1 right-5 z-20 flex h-6 max-w-[200px] items-center justify-between rounded-full px-3 transition-opacity duration-300 ease-in-out',
						{ 'opacity-0': hideUnreadButton, 'opacity-100': !hideUnreadButton }
					)}
				>
					<ArrowUp className='text-background size-4' />
					<Button
						className='h-5 rounded-full px-2 text-sm'
						onClick={async () => {
							lastReadRef.current?.scrollIntoView({ behavior: 'smooth' });
						}}
					>
						{unreadCount === 1 ? '1 new message' : `${unreadCount} new messages`}
					</Button>
				</div>
			)}
			<Button
				variant='default'
				size='icon'
				className={cn('absolute right-5 bottom-2 z-10 opacity-0', {
					'opacity-100': !isAutoScroll,
				})}
				onClick={() => {
					requestAnimationFrame(() => {
						scrollRef.current!.scrollTop = 0;
					});
				}}
			>
				<ArrowDown className='size-5' />
			</Button>
		</div>
	);
};

export default MessageList;
