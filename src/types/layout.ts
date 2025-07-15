import { LucideIcon } from 'lucide-react';

export type MenuKey = 'Home' | 'DMs' | 'Activity';

export type RightSidebarType = 'Reply' | 'File' | 'Profile';

export interface MainSidebarItemProps {
	name: MenuKey;
	icon: LucideIcon;
}
