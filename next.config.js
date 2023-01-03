/** @type {import('next').NextConfig} */
const nextConfig = {
	swcMinify: true,
	compiler: {
		styledComponents: true,
	},
	images: {
		domains: [
			's.yimg.com',
			'media.wired.com',
			'cdn.vox-cdn.com',
			'assets.coingecko.com',
			'res.cloudinary.com',
		],
		formats: ['image/webp'],
	},
	async redirects() {
		return [
			{
				source: '/community/profile',
				destination: '/community/articles',
				permanent: true,
			},
		];
	},
};

module.exports = nextConfig;
