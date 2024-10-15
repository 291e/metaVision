/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "avatars.githubusercontent.com",
				hostname: "www.metabank360.com",
				hostname: "meta360-s3-storage.s3.amazonaws.com",
				hostname: "metascan-s3.s3.amazonaws.com",
			},
		],
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	transpilePackages: ["three"],
};

export default nextConfig;
