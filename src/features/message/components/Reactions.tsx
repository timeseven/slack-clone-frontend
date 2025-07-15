'use client';

import emojiDict from 'emoji-dictionary';
import { SmilePlus } from 'lucide-react';

import Hint from '@/components/global/Hint';
import { Button } from '@/components/ui/button';
import { EmojiPopover } from '@/components/global/EmojiPopover';

import { UserRead } from '@/types/user';
import { ReactionRead } from '@/types/message';
import { WorkspaceMemberRead } from '@/types/workspace';

const Reactions = ({
	disabled,
	user,
	members,
	reactions,
	onChange,
}: {
	disabled?: boolean;
	user?: UserRead;
	members?: WorkspaceMemberRead[];
	reactions?: ReactionRead[];
	onChange: (emoji: string) => void;
}) => {
	const groupedReactions = reactions?.reduce(
		(groups, reaction) => {
			groups[reaction.emoji] = groups[reaction.emoji] || [];
			groups[reaction.emoji].push(reaction);
			return groups;
		},
		{} as Record<string, typeof reactions>
	);

	return (
		<div className='mt-1 flex flex-wrap items-center gap-2'>
			{Object.entries(groupedReactions || {}).map(([emoji, reactions]) => (
				<Hint
					label={
						<span className='flex max-w-[200px] flex-col items-center'>
							<span className='text-5xl'>{emoji}</span>
							<span className=''>
								{(() => {
									const otherReactors = reactions
										?.filter((reaction) => reaction.sender_id !== user?.id)
										.map((reaction) => members?.find((m) => m.id === reaction.sender_id)?.full_name);

									const youReacted = reactions?.some((reaction) => reaction.sender_id === user?.id);

									if (!otherReactors?.length && !youReacted) return null;

									const others = otherReactors.join(', ');
									if (otherReactors?.length && youReacted) {
										return `${others} and you reacted with :${emojiDict.getName(emoji)}:`;
									}
									if (youReacted) {
										return `You reacted with :${emojiDict.getName(emoji)}:`;
									}
									return `${others} reacted with :${emojiDict.getName(emoji)}:`;
								})()}
							</span>
						</span>
					}
					key={emoji}
				>
					<Button
						disabled={disabled}
						variant='default'
						className='flex h-7 items-center gap-x-1 rounded-xl border bg-gray-300 px-2 py-1! hover:border-gray-600 hover:bg-gray-300'
						onClick={() => onChange(emoji)}
					>
						<span className='size-[18px]'>{emoji}</span>
						<span className='text-muted-foreground leading-[18px]'>{reactions.length}</span>
					</Button>
				</Hint>
			))}
			{Object.entries(groupedReactions || {})?.length > 0 && (
				<EmojiPopover onEmojiSelect={(emoji) => onChange(emoji)}>
					<Button
						disabled={disabled}
						variant='default'
						className='group/emoji flex h-7 items-center gap-x-1 rounded-xl border bg-gray-300 px-2 py-1! text-black hover:border-gray-600 hover:bg-gray-300'
					>
						<SmilePlus className='group-hover/emoji:fill-yellow-500' />
					</Button>
				</EmojiPopover>
			)}
		</div>
	);
};

export default Reactions;
