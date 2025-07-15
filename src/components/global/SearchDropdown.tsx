'use client';

import * as React from 'react';
import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';

const items = [
	{ value: 'next.js', label: 'Next.js' },
	{ value: 'react', label: 'React' },
	{ value: 'vue', label: 'Vue' },
	{ value: 'nuxt', label: 'Nuxt.js' },
	{ value: 'svelte', label: 'Svelte' },
	{ value: 'angular', label: 'Angular' },
	{ value: 'tailwind', label: 'Tailwind CSS' },
	{ value: 'shadcn', label: 'shadcn/ui' },
];

const SearchDropdown = () => {
	const [searchQuery, setSearchQuery] = React.useState('');
	const [isOpen, setIsOpen] = React.useState(false);
	const inputRef = React.useRef<HTMLInputElement>(null);

	const filteredItems = React.useMemo(() => {
		if (!searchQuery) return [];
		return items.filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()));
	}, [searchQuery]);

	const handleSelect = (value: string) => {
		const selectedItem = items.find((item) => item.value === value);
		if (selectedItem) {
			setSearchQuery(selectedItem.label);
			setIsOpen(false);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchQuery(value);
		setIsOpen(value.length > 0);
	};

	const handleBlur = () => {
		setTimeout(() => {
			setIsOpen(false);
		}, 200);
	};

	return (
		<div className='relative px-3'>
			<div className='relative'>
				<SearchIcon className='text-muted absolute top-1/2 left-3 size-4 -translate-y-1/2' />
				<Input
					ref={inputRef}
					type='text'
					placeholder='Find a DM'
					className='placeholder:text-secondary focus-visible:ring-primary focus-visible:bg-primary pl-10 text-white focus-visible:border-white focus-visible:ring-[8px]'
					value={searchQuery}
					onChange={handleInputChange}
					onBlur={handleBlur}
				/>
			</div>

			{isOpen && (
				<div className='bg-popover absolute top-full left-0 z-10 mt-1 w-full rounded-md border shadow-md'>
					<Command>
						<CommandList>
							{filteredItems.length === 0 ? (
								<CommandEmpty>No items</CommandEmpty>
							) : (
								<CommandGroup>
									{filteredItems.map((item) => (
										<CommandItem
											key={item.value}
											value={item.value}
											onSelect={handleSelect}
											className='cursor-pointer'
											onMouseDown={(e) => {
												e.preventDefault();
											}}
										>
											{item.label}
										</CommandItem>
									))}
								</CommandGroup>
							)}
						</CommandList>
					</Command>
				</div>
			)}
		</div>
	);
};

export default SearchDropdown;
