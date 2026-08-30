import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "pub-80516a820ef941df9005d1d5efdd5526.r2.dev",
      },
    ],
  },
};

export default nextConfig;

