/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "nestjs-topcv-clone.onrender.com",
        port: "",
        pathname: "/images/**",
      },
    ],
    domains: ["localhost"],
  },
};

export default nextConfig;
