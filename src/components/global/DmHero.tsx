import React from 'react';
import AvatarContainer from './AvatarContainer';
import { ChannelMemberRead } from '@/types/channel';
import { useAuthContext } from '@/context/AuthContext';

interface DmHeroProps {
	channelMembers?: ChannelMemberRead[];
}

const DmHero = ({ channelMembers }: DmHeroProps) => {
	const { user } = useAuthContext();
	const is_self_dm = channelMembers?.length === 1;
	const avatar = is_self_dm ? user?.avatar : channelMembers?.filter((member) => member.id !== user?.id)[0]?.avatar;
	const name = is_self_dm ? user?.full_name : channelMembers?.filter((member) => member.id !== user?.id)[0]?.full_name;
	return (
		<div className='mx-5 mt-[88px] mb-4'>
			<div className='mb-2 flex items-center gap-x-1'>
				<AvatarContainer
					src={avatar}
					alt={name}
					name={name}
					avatarClassName='size-11 rounded-md'
					fallbackClassName='flex size-11 items-center justify-center rounded-md bg-black/70 font-bold text-white'
				/>
				<p className='truncate text-2xl font-bold'>{name}</p>
			</div>
			{is_self_dm ? (
				<p>
					This is your space. Draft messages, make to-do lists or keep links and files to hand. You can also talk to
					yourself here, but please bear in mind you’ll have to provide both sides of the conversation.
				</p>
			) : (
				<p className='mb-4 flex items-center gap-x-1 font-normal text-slate-800'>
					This conversation is just between you and{' '}
					<strong className='inline-block max-w-[200px] truncate'>{name}</strong>
				</p>
			)}
		</div>
	);
};

export default DmHero;
