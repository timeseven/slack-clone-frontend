'use client';

import { useMemo, useState } from 'react';
import { Crown, Search, ShieldUser, UserRound, UserRoundMinus } from 'lucide-react';

import useDebounce from '@/hooks/useDebounce';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import MemberList from '@/features/user/components/MemberList';
import Hint from '@/components/global/Hint';
import Loading from '@/components/svg/Loading';
import { cn } from '@/lib/utils';
import { WorkspaceMemberRead, WorkspaceRead } from '@/types/workspace';
import {
	useRemoveMemberFromWorkspace,
	useSetWorkspaceRole,
	useTransferWorkspace,
} from '@/features/workspace/hooks/useWorkspaceApiHooks';

const WorkspaceMemberSearch = ({ workspace, onSuccess }: { workspace?: WorkspaceRead; onSuccess?: () => void }) => {
	const [searchValue, setSearchValue] = useState('');
	const debouncedSearchValue = useDebounce(searchValue, 500);
	const filterDebouncedValue = String(debouncedSearchValue).replace(/\s+/g, ' ').trim();

	const transferWorkspace = useTransferWorkspace();
	const removeMemberFromWorkspace = useRemoveMemberFromWorkspace();
	const setWorkspaceRole = useSetWorkspaceRole();

	const workspaceSearchMembers = useMemo(() => {
		return workspace?.members?.filter((member) => {
			return member.full_name.toLowerCase().includes(filterDebouncedValue.toLowerCase());
		});
	}, [filterDebouncedValue, workspace?.members]);

	const handleTransferOwnership = async (member: WorkspaceMemberRead) => {
		try {
			await transferWorkspace.mutateAsync({
				workspaceId: workspace?.id || '',
				userId: member?.id || '',
			});
			onSuccess?.();
		} catch (error) {
			console.log(error);
		}
	};

	const handleRemoveMemberFromWorkspace = async (member: WorkspaceMemberRead) => {
		try {
			await removeMemberFromWorkspace.mutateAsync({
				workspaceId: workspace?.id || '',
				userId: member?.id || '',
			});
			onSuccess?.();
		} catch (error) {
			console.log(error);
		}
	};

	const handleSetWorkspaceRole = async (member: WorkspaceMemberRead, role: 'admin' | 'member') => {
		try {
			await setWorkspaceRole.mutateAsync({
				workspaceId: workspace?.id || '',
				data: {
					user_id: member.id,
					role,
				},
			});
			onSuccess?.();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='relative flex h-[500px] flex-col gap-2'>
			<div className='focus-within:ring-ring relative mx-5 flex items-center rounded-md border pl-2 focus-within:ring-1'>
				<Search className='text-muted-foreground h-5 w-5' />
				<Input
					type='email'
					placeholder='Find a member'
					className='border-0 shadow-none focus-visible:ring-0'
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
					autoFocus
				/>
			</div>
			{searchValue && searchValue !== debouncedSearchValue && (
				<Loading className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
			)}
			<div className={cn('flex flex-col')}>
				<MemberList
					members={workspaceSearchMembers}
					extra={(member) => {
						return (
							<>
								{/* Transfer ownership */}
								{workspace?.membership?.role === 'owner' && member?.role !== 'owner' && (
									<Hint label='Transfer ownership' side='top' align='center'>
										<Button variant='default' size='icon' onClick={async () => handleTransferOwnership(member)}>
											<Crown />
										</Button>
									</Hint>
								)}
								{/* Set admin to member */}
								{workspace?.membership?.role === 'owner' && member?.role === 'admin' && (
									<Hint label='Set as user' side='top' align='center'>
										<Button
											variant='default'
											size='icon'
											onClick={async () => handleSetWorkspaceRole(member, 'member')}
										>
											<UserRound />
										</Button>
									</Hint>
								)}
								{/* Set member to admin */}
								{workspace?.membership?.role === 'owner' && member?.role === 'member' && (
									<Hint label='Set as admin' side='top' align='center'>
										<Button variant='default' size='icon' onClick={async () => handleSetWorkspaceRole(member, 'admin')}>
											<ShieldUser />
										</Button>
									</Hint>
								)}
								{/* Remove from workspace */}
								{workspace?.membership?.role === 'owner' && member?.role !== 'owner' && (
									<Hint label='Remove from workspace' side='top' align='center'>
										<Button
											variant='destructive'
											size='icon'
											onClick={async () => handleRemoveMemberFromWorkspace(member)}
										>
											<UserRoundMinus />
										</Button>
									</Hint>
								)}
							</>
						);
					}}
				/>
			</div>
		</div>
	);
};

export default WorkspaceMemberSearch;
