import React from 'react';

const GlobalLoading = ({ name }: { name?: string }) => {
	return (
		<div className='loading-background'>
			<div className='scene'>
				<div className='cube-wrapper'>
					<div className='cube'>
						<div className='cube-face front'></div>
						<div className='cube-face back'></div>
						<div className='cube-face right'></div>
						<div className='cube-face left'></div>
						<div className='cube-face top'></div>
						<div className='cube-face shadow'></div>
					</div>
				</div>
				<div className='absolute top-2/3 flex items-center justify-center text-xl font-bold'>
					{name || 'Loading'}...
				</div>
			</div>
		</div>
	);
};

export default GlobalLoading;
