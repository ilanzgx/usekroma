import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const nextConfig: NextConfig = {
  output: "standalone",
  rewrites: async () => [
    {
      source: "/v1/:path*",
      destination: `${API_URL}/:path*`,
    },
  ],
};

export default nextConfig;
