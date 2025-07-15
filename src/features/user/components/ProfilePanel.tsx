'use client';

import React, { useMemo, useState } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { Clock, Mail, MessageCircle } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import LiveClock from '@/components/global/LiveClock';
import { Separator } from '@/components/ui/separator';

import { cn, dataURLtoFile } from '@/lib/utils';
import useRouteStore from '@/stores/useRouteStore';
import { useAuthContext } from '@/context/AuthContext';

import useWorkspaceStore from '@/features/workspace/stores/useWorkspaceStore';
import UploadAvatarDialog from '@/features/user/components/UploadAvatarDialog';
import { useGetUser, useUpdateMe, useUploadAvatar } from '@/features/user/hooks/useUserApiHooks';
import { useGetOrCreateDms } from '@/features/channel/hooks/useChannelApiHooks';
import { queryClient } from '@/context/ReactQueryContext';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProfilePanel = ({ data }: { data: any }) => {
	const { user } = useAuthContext();
	const currentWorkspaceId = useWorkspaceStore((state) => state.currentWorkspaceId);
	const currentMenu = useRouteStore((state) => state.currentMenu);
	const setRouteMap = useRouteStore((state) => state.setRouteMap);
	const setDmRouteMap = useRouteStore((state) => state.setDmRouteMap);
	const { userId } = data;
	const updateMe = useUpdateMe();
	const uploadAvatar = useUploadAvatar();
	const getOrCreateDms = useGetOrCreateDms();
	const { data: userData } = useGetUser(userId);

	const profile = useMemo(() => {
		if (userId === user?.id) return user;
		return userData;
	}, [user, userId, userData]);

	const [isEditName, setIsEditName] = useState(false);
	const [name, setName] = useState(profile?.full_name || '');
	const [openUploadAvatar, setOpenUploadAvatar] = useState(false);

	const statusOptions = {
		online: 'h-2.5 w-2.5 rounded-full bg-green-500 ',
		offline: 'h-2.5 w-2.5 rounded-full bg-gray-500 ',
		hidden: 'h-2.5 w-2.5 rounded-full bg-white  border-2 border-gray-500',
	};
	const handleUploadAvatar = async (image: string) => {
		const file = dataURLtoFile(image, `${profile?.id}_avatar.jpg`);
		const formData = new FormData();
		formData.append('file', file);
		try {
			await uploadAvatar.mutateAsync(formData);
			queryClient.invalidateQueries({ queryKey: ['me'] });
			setOpenUploadAvatar(false);
		} catch (error) {
			console.log(error);
		}
	};

	const handleUpdateName = async () => {
		if (name === profile?.full_name) {
			setIsEditName(false);
			return;
		}

		try {
			await updateMe.mutateAsync({ full_name: name });
			setIsEditName(false);
			queryClient.invalidateQueries({ queryKey: ['me'] });
		} catch (error) {
			console.log(error);
		}
	};

	const handleCancelUpdateName = () => {
		setName(profile?.full_name || '');
		setIsEditName(false);
	};

	return (
		<>
			<div className='flex h-full flex-col gap-y-2 px-4 py-2'>
				<div className='flex w-full items-center justify-center'>
					<div className='relative'>
						<Image
							src={profile?.avatar || '/images/square-user-round.svg'}
							alt={profile?.full_name || ''}
							className='object-cover'
							width={250}
							height={250}
							priority
						/>
						{user?.id === userId && (
							<Button
								variant='outline'
								size='sm'
								className='absolute top-1 right-2'
								onClick={() => setOpenUploadAvatar(true)}
							>
								{' '}
								Upload photo
							</Button>
						)}
					</div>
				</div>
				<div className='flex flex-col gap-y-2'>
					<div className='flex items-center justify-between gap-x-4'>
						{!isEditName ? (
							<div className='truncate text-xl font-bold'>{profile?.full_name}</div>
						) : (
							<Input value={name} autoFocus onChange={(e) => setName(e.target.value)} />
						)}
						{user?.id === userId &&
							(!isEditName ? (
								<Button variant='link' onClick={() => setIsEditName(true)}>
									<div className='font-semibold'>Edit</div>
								</Button>
							) : (
								<div className='flex items-center gap-x-2'>
									<Button variant='destructive' onClick={handleCancelUpdateName}>
										Cancel
									</Button>
									<Button onClick={handleUpdateName}>Save</Button>
								</div>
							))}
					</div>
					<div className='flex items-center gap-x-2'>
						<div className='flex w-5 items-center justify-center'>
							<div className={cn(statusOptions['online'])} />
						</div>
						<div className='text-md'>Online</div>
					</div>
					<div className='flex items-center gap-x-2'>
						<Clock size={20} strokeWidth={2} />
						<div className='flex items-center gap-x-2'>
							<LiveClock /> local Time
						</div>
					</div>
				</div>
				<Button
					variant='outline'
					onClick={async () => {
						try {
							setDmRouteMap(currentMenu, `/workspace/${currentWorkspaceId}/members/${profile.id}`);
							const response = await getOrCreateDms.mutateAsync({
								workspaceId: currentWorkspaceId,
								userId: profile?.id,
							});
							const { channel_id } = response.data;
							setRouteMap(currentMenu, `/workspace/${currentWorkspaceId}/${channel_id}`);
						} catch (error) {
							console.log('error', error);
						}
					}}
				>
					<MessageCircle className='scale-x-[-1] transform' /> Message
				</Button>
				<Separator />
				<div className='flex flex-col justify-center gap-y-2'>
					<div className='text-md font-bold'>Contact information</div>
					<div className='flex items-center gap-x-2'>
						<div className='bg-accent flex size-9 items-center justify-center rounded-md'>
							<Mail size={16} />
						</div>
						{profile?.email && (
							<div className='flex flex-col'>
								<div className='text-sm font-bold'>Email address</div>
								<Link href={`mailto:${profile?.email}`} className='hover:text-primary text-sm'>
									{profile?.email}
								</Link>
							</div>
						)}
					</div>
				</div>
			</div>
			<UploadAvatarDialog
				user_name={user?.full_name || ''}
				open={openUploadAvatar}
				setOpen={setOpenUploadAvatar}
				onSave={handleUploadAvatar}
			/>
		</>
	);
};

export default ProfilePanel;
