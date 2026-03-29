import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/good-news-site",
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
