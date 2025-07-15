import { ReactNode } from 'react';

export interface HintProps {
	label: string | ReactNode;
	children: ReactNode;
	sideOffset?: number;
	side?: 'top' | 'right' | 'bottom' | 'left';
	align?: 'start' | 'center' | 'end';
	showArrow?: boolean;
	className?: string;
}

export interface ApiResponse<T> {
	code: number;
	message: string;
	data: T;
}
