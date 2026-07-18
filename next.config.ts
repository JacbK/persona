import type { NextConfig } from "next";

const isGitHubPages = process.env.PERSONA_STATIC_EXPORT === "true";
const githubPagesBasePath = process.env.GITHUB_PAGES_BASE_PATH || "";

const nextConfig: NextConfig = {
  ...(isGitHubPages
    ? {
        output: "export",
        images: { unoptimized: true },
        basePath: githubPagesBasePath,
      }
    : {}),
};

export default nextConfig;
