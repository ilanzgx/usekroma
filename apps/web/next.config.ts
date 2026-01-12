import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  rewrites: async () => [
    {
      source: "/v1/:path*",
      destination: process.env.NEXT_PUBLIC_API_URL + "/:path*",
    },
  ],
};

export default nextConfig;
