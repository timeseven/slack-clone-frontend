import { ChannelMemberRead } from '@/types/channel';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/context/AuthContext';

interface ChannelHeroProps {
	disabled?: boolean;
	channelName?: string;
	channelCreatedAt?: string;
	owner?: ChannelMemberRead;
}

const ChannelHero = ({ disabled, channelName, channelCreatedAt, owner }: ChannelHeroProps) => {
	const { user } = useAuthContext();
	return (
		<div className='flex h-40 flex-col justify-end p-5'>
			<p className='mb-2 flex items-center truncate text-2xl font-bold'># {channelName}</p>
			<p className='mb-4 font-normal text-slate-800'>
				{user?.id === owner?.id ? (
					'You '
				) : (
					<Button variant='link' className='text-md px-1' disabled={disabled}>
						<span className='max-w-[200px] truncate'>@{owner?.full_name}</span>
					</Button>
				)}
				created this channel on {format(new Date(channelCreatedAt!), 'd MMMM yyyy')}. This is the very beginning of the{' '}
				<strong># {channelName}</strong> channel.
			</p>
		</div>
	);
};

export default ChannelHero;
