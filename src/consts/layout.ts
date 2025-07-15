import { MainSidebarItemProps } from '@/types/layout';
import { House } from 'lucide-react';

export const DEFAULT_LEFT_SIZE = 20;
export const MIN_LEFT_SIZE = 15;
export const MAX_LEFT_SIZE = 60;
export const DEFAULT_RIGHT_SIZE = 30;
export const MIN_RIGHT_SIZE = 20;
export const FULL_SIZE = 100;
export const MIN_MIDDLE_SIZE = 20;

export const menuList: MainSidebarItemProps[] = [
	{
		name: 'Home',
		icon: House,
	},
	// },
	// {
	// 	name: 'DMs',
	// 	icon: MessagesSquare,
	// },

	// {
	// 	name: 'Activity',
	// 	icon: Bell,
	// },
];
