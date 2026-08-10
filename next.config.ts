import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages ? "/kosti" : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: isGithubPages ? "export" : undefined,
  basePath,
  assetPrefix: isGithubPages ? `${basePath}/` : undefined,
  trailingSlash: isGithubPages,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: isGithubPages,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dqcdbdt4v/**",
      },
      {
        protocol: "https",
        hostname: "mybln.de",
        pathname: "/fileadmin/**",
      },
    ],
  },
};

export default nextConfig;
