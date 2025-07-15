'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { ExtendedCommandDialog } from '@/components/extended/extended-command';
import { CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

import useWorkspaceStore from '@/features/workspace/stores/useWorkspaceStore';
import useDebounce from '@/hooks/useDebounce';
import useRouteStore from '@/stores/useRouteStore';
import { useGetWorkspace } from '@/features/workspace/hooks/useWorkspaceApiHooks';
import { useSearchChannels } from '@/features/channel/hooks/useChannelApiHooks';

const SearchDialog = () => {
	const [open, setOpen] = useState(false);
	const containerRef = useRef(null);
	const [searchValue, setSearchValue] = useState('');
	const debouncedSearchValue = useDebounce(searchValue, 500);
	const filterDebouncedValue = debouncedSearchValue.replace(/\s+/g, ' ').trim();
	const currentWorkspaceId = useWorkspaceStore((state) => state.currentWorkspaceId);
	const currentMenu = useRouteStore((state) => state.currentMenu);
	const setRouteMap = useRouteStore((state) => state.setRouteMap);
	const { data: workspace } = useGetWorkspace(currentWorkspaceId!);
	const { data: searchChannels, isLoading } = useSearchChannels(currentWorkspaceId!, filterDebouncedValue, {
		enabled: !!filterDebouncedValue && !!currentWorkspaceId,
	});

	const renderContent = () => {
		if (!filterDebouncedValue) {
			return (
				<div className='px-2 py-6 text-center'>
					<Search className='text-muted-foreground mx-auto mb-2 h-6 w-6' />
					<p className='text-muted-foreground text-sm'>Start typing to search</p>
				</div>
			);
		}

		if (isLoading) {
			return (
				<div className='px-2 py-6 text-center'>
					<div className='border-primary mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-b-2'></div>
					<p className='text-muted-foreground text-sm'>Searching...</p>
				</div>
			);
		}
		const hasChannels = searchChannels && Array.isArray(searchChannels) && searchChannels.length > 0;

		const filteredMembers = workspace?.members?.filter((member) =>
			member.full_name.toLowerCase().includes(filterDebouncedValue.toLowerCase())
		);
		const hasFilteredMembers = filteredMembers && Array.isArray(filteredMembers) && filteredMembers.length > 0;

		if (!hasChannels && !hasFilteredMembers) {
			return (
				<div className='px-2 py-6 text-center'>
					<Search className='text-muted-foreground mx-auto mb-2 h-6 w-6' />
					<p className='text-muted-foreground text-sm'>No results found</p>
					<p className='text-muted-foreground mt-1 text-xs'>Try searching for different keywords</p>
				</div>
			);
		}

		return (
			<>
				{hasChannels && (
					<CommandGroup heading={`Channels (${searchChannels.length})`}>
						{searchChannels.map((channel) => (
							<CommandItem key={`channel-${channel.id}`} asChild>
								<div
									className='flex cursor-pointer items-center gap-1'
									onClick={() => {
										setRouteMap(currentMenu, `/workspace/${currentWorkspaceId}/${channel.id}`);
										setOpen(false);
									}}
								>
									<span className='text-muted-foreground'>#</span>
									<span>{channel.name}</span>
								</div>
							</CommandItem>
						))}
					</CommandGroup>
				)}

				{hasFilteredMembers && (
					<CommandGroup heading={`Members (${filteredMembers.length})`}>
						{filteredMembers.map((member) => (
							<CommandItem className='flex cursor-pointer items-center gap-1' key={`member-${member.id}`}>
								<span className='text-muted-foreground'>@</span>
								<span>{member.full_name}</span>
							</CommandItem>
						))}
					</CommandGroup>
				)}
			</>
		);
	};

	return (
		<div ref={containerRef} className='relative w-full basis-2/3'>
			<Button
				size='sm'
				className='bg-muted/20 hover:bg-muted/70 text-muted-foreground h-7 w-full justify-start px-2'
				onClick={() => setOpen(true)}
			>
				<Search className='mr-2 size-4 text-white' />
				<span className='text-xs text-white'>Search {workspace?.name}</span>
			</Button>

			<ExtendedCommandDialog
				open={open}
				onOpenChange={setOpen}
				container={containerRef.current || undefined}
				showOverlay={false}
				shouldFilter={false}
				className='absolute top-0 left-0 sm:max-w-full'
			>
				<CommandInput placeholder='Search channels and members...' value={searchValue} onValueChange={setSearchValue} />
				<CommandList>{renderContent()}</CommandList>
			</ExtendedCommandDialog>
		</div>
	);
};

export default SearchDialog;
