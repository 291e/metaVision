/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com",
      },
      {
        hostname: "www.metabank360.com",
      },
      {
        hostname: "meta360-s3-storage.s3.amazonaws.com",
      },
      {
        hostname: "metascan-s3.s3.amazonaws.com",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ["three"],
  async rewrites() {
    return [
      {
        source: "/api/ws/:path*",
        destination:
          "http://ec2-43-200-145-70.ap-northeast-2.compute.amazonaws.com:5100/ws/:path*",
      },
      {
        source: "/api/generate",
        destination:
          "http://ec2-43-200-145-70.ap-northeast-2.compute.amazonaws.com:5100/generate",
      },
      {
        source: "/api/queue_status",
        destination:
          "http://ec2-43-200-145-70.ap-northeast-2.compute.amazonaws.com:5100/queue_status",
      },
      {
        source: "/api/graphql",
        destination: "http://192.168.0.202:4000/graphql",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
