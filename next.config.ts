import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /*
     * Next 16 changed `images.qualities` from "allow anything" to `[75]`, and a
     * `quality` prop outside the list is **silently coerced** to the nearest allowed
     * value rather than erroring — `quality={90}` on the menu's hover plate was
     * serving q=75 with no warning anywhere. See
     * node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md.
     */
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
