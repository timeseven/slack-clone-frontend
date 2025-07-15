'use client';

import React from 'react';

import { Crown, ShieldUser, UserRound } from 'lucide-react';

import Hint from '@/components/global/Hint';
import AvatarContainer from '@/components/global/AvatarContainer';

import { useAuthContext } from '@/context/AuthContext';
import { WorkspaceMemberRead } from '@/types/workspace';
import { Button } from '@/components/ui/button';

const MemberList = ({
	members,
	extra,
}: {
	members?: WorkspaceMemberRead[];
	extra?: (member: WorkspaceMemberRead) => React.ReactNode;
}) => {
	const { user } = useAuthContext();
	return (
		<div className='max-h-96 space-y-2 overflow-y-auto'>
			{members?.map((member) => (
				<div
					key={member.id}
					className='hover:bg-secondary flex cursor-pointer items-center gap-3 px-5 py-2 transition-colors'
				>
					<AvatarContainer
						src={member?.avatar}
						alt={member?.full_name}
						name={member?.full_name}
						avatarClassName='size-10'
						fallbackClassName='bg-indigo-500 text-white'
					/>
					<div className='min-w-0 flex-1'>
						<p className='text-foreground truncate text-sm font-medium'>
							{member?.full_name} {member?.id === user?.id && '(You)'}
						</p>
						{member?.email && <p className='text-muted-foreground truncate text-xs'>{member.email}</p>}
					</div>
					<div className='flex items-center gap-x-1'>
						{member?.role === 'owner' && (
							<Hint label='Owner' side='top' align='center'>
								<Crown className='size-4 text-yellow-600' />
							</Hint>
						)}
						{member?.role === 'admin' && (
							<Hint label='Admin' side='top' align='center'>
								<ShieldUser className='text-primary size-4' />
							</Hint>
						)}
						{member?.role === 'member' && (
							<Hint label='Member' side='top' align='center'>
								<UserRound className='size-4' />
							</Hint>
						)}
					</div>
					{extra?.(member)}
				</div>
			))}
			{(!members || members.length === 0) && (
				<div className='text-muted-foreground flex items-center gap-2 px-5 py-2 text-center'>
					<Button variant='ghost' size='icon' disabled className='bg-muted'>
						<UserRound className='size-5' />
					</Button>
					<span className='text-sm font-semibold text-gray-400'>No matches</span>
				</div>
			)}
		</div>
	);
};

export default MemberList;
