import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.GITHUB_PAGES ? "/persona/creative-example" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
