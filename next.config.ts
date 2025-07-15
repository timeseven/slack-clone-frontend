import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	devIndicators: false,
	reactStrictMode: false,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'pm-files-bucket.s3.ap-southeast-2.amazonaws.com',
				pathname: '**',
			},
		],
	},
};

export default nextConfig;
