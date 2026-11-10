import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Belt and braces next to the middleware: static assets are noindex too
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default nextConfig;
