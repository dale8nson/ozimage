import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  transpilePackages: ['three'],
};

export default nextConfig;
