import React from 'react';

import { ChevronDown } from 'lucide-react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const MessageFilterButton = () => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' className='hover:bg-primary flex w-full items-center justify-start'>
					<span className='truncate text-xl font-bold text-white'>Direct messages</span>
					<ChevronDown className='text-white' />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent className='min-w-64 rounded-lg' align='start' sideOffset={5}>
				<DropdownMenuSub>
					<DropdownMenuSubTrigger className='cursor-pointer gap-x-3 p-3'>Filter conversations</DropdownMenuSubTrigger>
					<DropdownMenuPortal>
						<DropdownMenuSubContent>
							<RadioGroup defaultValue='comfortable' className='flex flex-col gap-y-1'>
								<DropdownMenuItem className='flex items-center gap-x-2 p-3'>
									<RadioGroupItem value='default' id='r1' />
									<Label htmlFor='r1'>Default</Label>
								</DropdownMenuItem>
								<DropdownMenuItem className='flex items-center gap-x-2 p-3'>
									<RadioGroupItem value='comfortable' id='r2' />
									<Label htmlFor='r2'>Comfortable</Label>
								</DropdownMenuItem>
								<DropdownMenuItem className='flex items-center gap-x-2 p-3'>
									<RadioGroupItem value='compact' id='r3' />
									<Label htmlFor='r3'>Compact</Label>
								</DropdownMenuItem>
							</RadioGroup>
						</DropdownMenuSubContent>
					</DropdownMenuPortal>
				</DropdownMenuSub>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default MessageFilterButton;
