export interface PhasebarArrowProps {
	width?: string;
	height?: string;
}

const PhasebarArrow = ({ width = '80px', height = '40px' }: PhasebarArrowProps) => {
	const baseWidth = 80;

	const scaleX = parseFloat(width) / baseWidth;

	// calculate the points based on the scale
	const points = `${75 + (scaleX - 1) * 10},0 100,25 ${75 + (scaleX - 1) * 10},50 0,50 ${25 - (scaleX - 1) * 10},25 0,0`;

	return (
		<svg viewBox='0 0 100 50' preserveAspectRatio='none' width={width} height={height}>
			<polygon points={points} fill='currentColor' />
		</svg>
	);
};

export default PhasebarArrow;
