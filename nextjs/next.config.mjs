/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8088",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "nestjs-topcv-clone.onrender.com",
        port: "",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
