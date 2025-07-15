import * as React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

type AvatarProps = React.ComponentProps<typeof Avatar>;

interface AvatarGroupProps extends React.ComponentProps<'div'> {
	children?: React.ReactElement<AvatarProps> | React.ReactElement<AvatarProps>[];
	max?: number;
	offset?: string;
	showNumber?: boolean;
}

const AvatarGroup = ({ children, max = 3, showNumber = true, offset, className, ...props }: AvatarGroupProps) => {
	const totalAvatars = React.Children.count(children);
	const displayedAvatars = React.Children.toArray(children).slice(0, max).reverse();

	return (
		<div
			className={cn(
				buttonVariants({ variant: 'outline', size: 'sm' }),
				'flex cursor-pointer flex-row-reverse items-center',
				className
			)}
			{...props}
		>
			{showNumber && <div>{totalAvatars}</div>}

			{displayedAvatars.map((avatar, index) => {
				if (!React.isValidElement(avatar)) return null;
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const existingProps = avatar.props as any;
				const containerProps = typeof existingProps.containerProps === 'object' ? existingProps.containerProps : {};
				return (
					<div key={index} className='relative -ml-2'>
						{React.cloneElement(avatar, {
							...existingProps,
							containerProps: {
								...containerProps,
								className: cn('rounded-md ring-2 ring-background size-6', offset),
							},
						})}
					</div>
				);
			})}
		</div>
	);
};

export default AvatarGroup;
