import type { NextConfig } from "next";
import { securityHeaders } from "./lib/security-headers";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  // Cache Components / partial prefetching are off: every page here is fully static, and the
  // Cloudflare Workers runtime can't run Cache Components reliably yet (OpenNext warns about setTimeout).
  images: {
    // Static hosting: serve pre-sized WebP files instead of a paid runtime optimizer.
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders(process.env.NODE_ENV === "production"),
      },
    ];
  },
  async redirects() {
    // 301 rather than Next's default 308: these pages are gone for good and 301 is the most widely understood.
    return [
      { source: "/pricing", destination: "/get-started", statusCode: 301 },
      { source: "/contact", destination: "/get-started", statusCode: 301 },
      { source: "/automation", destination: "/services#automation", statusCode: 301 },
      { source: "/websites", destination: "/services#build", statusCode: 301 },
    ];
  },
};

export default nextConfig;

// Lets `next dev` use Cloudflare bindings locally. No effect on production builds.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
