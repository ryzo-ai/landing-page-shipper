import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Demo deploy: this prototype must never be indexed. The meta tag in
  // app/layout.tsx covers HTML; this header covers every response type
  // and any crawler that skips meta parsing.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive, nosnippet' },
        ],
      },
    ]
  },
};

export default nextConfig;
