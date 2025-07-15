import Image from 'next/image';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface ThumbnailProps {
	url?: string | null;
}

const Thumbnail = ({ url }: ThumbnailProps) => {
	if (!url) return null;

	return (
		<Dialog>
			<DialogTrigger asChild>
				<div className='relative my-2 max-w-[360px] cursor-zoom-in overflow-hidden rounded-lg border'>
					<Image src={url} alt='Message image' width={400} height={300} />
				</div>
			</DialogTrigger>
			<DialogContent className='max-w-[800px] border-none bg-transparent p-0 shadow-none'>
				<Image src={url} alt='Message image' width={400} height={300} />
			</DialogContent>
		</Dialog>
	);
};

export default Thumbnail;
