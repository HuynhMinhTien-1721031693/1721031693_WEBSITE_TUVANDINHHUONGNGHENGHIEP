import type { NextConfig } from "next";

const backendOrigin =
  process.env.BACKEND_PROXY_URL?.replace(/\/$/, "") ||
  process.env.BACKEND_URL?.replace(/\/$/, "") ||
  "http://localhost:4000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/api/auth/:path*", destination: `${backendOrigin}/api/auth/:path*` },
      { source: "/api/history/:path*", destination: `${backendOrigin}/api/history/:path*` },
      { source: "/api/assessment/:path*", destination: `${backendOrigin}/api/assessment/:path*` },
    ];
  },
};

export default nextConfig;
